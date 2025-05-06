import OpenAI from 'openai';
import { format } from 'date-fns';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ExtractedInfo {
  type: 'travel' | 'event' | 'lyrics';
  destination?: string;
  date?: string;
  event?: string;
  lyrics?: string;
}

export async function extractTravelInfo(message: string): Promise<ExtractedInfo> {
  const systemPrompt = `You are a fashion AI assistant. Extract either travel information, event type, or song lyrics intent from the user's message and return it in JSON format.

For travel requests:
- Extract destination and date
- Use YYYY-MM-DD format for dates
- For "next week" use the same day next week
- For "this weekend" use the coming Saturday
- For months without a day, use the 15th
- For seasons, use: Spring (April 15), Summer (July 15), Fall (October 15), Winter (January 15)
- If no year is specified, use the next occurrence
- All dates should be within the next 365 days

For event requests:
- Identify specific event types:
  - Formal: wedding, gala, black tie, formal dinner
  - Semi-formal: graduation, business dinner, cocktail party
  - Casual: house party, backyard BBQ, brunch
  - Special: beach party, yacht party, pool party
  - Festive: holiday party, New Year's Eve, Christmas party
  - Cultural: traditional ceremony, religious event
  - Entertainment: concert, music festival, rave, club night
  - Professional: job interview, business meeting, conference
  - Celebratory: birthday party, anniversary, engagement party
  - Seasonal: summer picnic, winter formal, spring garden party

For song lyrics:
- If the message contains or references lyrics or a song name, return type as "lyrics" and include the lyrics or song name in the "lyrics" field.

Expected JSON formats:
{
  "type": "travel",
  "destination": "city or location",
  "date": "YYYY-MM-DD"
}
{
  "type": "event",
  "event": "specific event type from the list above"
}
{
  "type": "lyrics",
  "lyrics": "quoted lyrics or song name"
}`;

  if (!message.trim()) {
    throw new Error('Please provide a travel destination, event type, or song lyrics');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Please provide more details about your travel plans, event type, or lyrics');
    }

    let result: ExtractedInfo;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Could not understand your request. Please try being more specific');
    }

    if (!result.type || !['travel', 'event', 'lyrics'].includes(result.type)) {
      throw new Error('Please specify either travel, event, or lyrics');
    }

    if (result.type === 'travel') {
      if (!result.destination || !result.date) {
        throw new Error('Missing destination or date for travel');
      }
    } else if (result.type === 'event') {
      if (!result.event) {
        throw new Error('Missing event type');
      }
    } else if (result.type === 'lyrics') {
      if (!result.lyrics) {
        throw new Error('Missing lyrics or song name');
      }
    }

    return result;
  } catch (error: any) {
    console.error('Error in extractTravelInfo:', error);
    throw new Error(error.message || 'Failed to process your request');
  }
}

export async function generateOutfitSuggestions(params: { weather?: any; event?: string; lyrics?: string }): Promise<any[]> {
  const { weather, event, lyrics } = params;
  let prompt = '';

  if (weather) {
    const temp = Math.round(weather.temperature);
    const season = getSeason(new Date(weather.date));

    prompt = `Generate 4 outfit recommendations for ${weather.location}. For each outfit, provide:

1. A fashionable name for the overall look
2. A detailed list of clothing items with specific types and colors:
   - Top: type (e.g., cotton t-shirt, silk blouse), color, any details
   - Bottom: type (e.g., straight-leg jeans, pleated skirt), color, fit
   - Outerwear (if needed): type (e.g., denim jacket, wool coat), color
   - Shoes: type (e.g., leather sneakers, ankle boots), color
   - Accessories: specific items (e.g., leather crossbody bag, gold hoop earrings)

Weather conditions:
- Temperature: ${temp}°F (${getTemperatureCategory(temp)})
- Weather: ${weather.description}
- Season: ${season}
- Humidity: ${weather.details.humidity}%
- Wind: ${weather.details.windSpeed} mph
${weather.details.precipitation ? `- Precipitation: ${weather.details.precipitation}%` : ''}`;

  } else if (event) {
    prompt = `Generate 4 outfit recommendations for a ${event}. For each outfit, provide:

1. A fashionable name for the overall look
2. A detailed list of clothing items with specific types and colors:
   - Top: type (e.g., dress shirt, silk blouse), color, any details
   - Bottom: type (e.g., tailored pants, A-line skirt), color, fit
   - Full Dress/Suit (if applicable): type, color, fit
   - Shoes: type (e.g., oxford shoes, stiletto heels), color
   - Accessories: specific items (e.g., pearl necklace, leather belt)`;
  } else if (lyrics) {
    prompt = `Generate 4 fashion outfits inspired by the following lyrics or song: "${lyrics}". For each outfit, provide:

1. A poetic or expressive name for the overall look
2. A detailed list of clothing items with specific types, colors, and emotions:
   - Top: type and color, with emotional or lyrical influence
   - Bottom: type and color
   - Outerwear (if any): style and mood tone
   - Shoes: type, color, attitude
   - Accessories: items that echo the song's theme or era`;
  }

  prompt += `

Return a valid JSON array with exactly 4 outfit objects. Each object must have:
{
  "type": "Fashionable outfit name",
  "description": "Top: [details], Bottom: [details], Shoes: [details], Accessories: [details]",
  "searchQuery": "Main item search term",
  "imagePrompt": "Brief photo description"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful fashion assistant. Provide clear, detailed clothing descriptions with specific items and colors. Balance style with practicality.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      console.error('Empty response from OpenAI');
      return [];
    }

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const cleanedContent = jsonMatch[0].replace(/,(\s*[}\]])/g, '$1');
      const outfits = JSON.parse(cleanedContent);

      if (!Array.isArray(outfits) || outfits.length === 0) {
        throw new Error('Invalid or empty array in response');
      }

      const validOutfits = outfits.filter(outfit => 
        outfit &&
        typeof outfit === 'object' &&
        typeof outfit.type === 'string' &&
        typeof outfit.description === 'string' &&
        typeof outfit.searchQuery === 'string' &&
        typeof outfit.imagePrompt === 'string'
      );

      if (validOutfits.length === 0) {
        throw new Error('No valid outfit objects in response');
      }

      return validOutfits;
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Raw content:', content);
      return [];
    }
  } catch (error: any) {
    console.error('Error generating outfit suggestions:', error);
    return [];
  }
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Fall';
  return 'Winter';
}

function getTemperatureCategory(temp: number): string {
  if (temp >= 85) return 'Very Hot';
  if (temp >= 75) return 'Hot';
  if (temp >= 65) return 'Warm';
  if (temp >= 55) return 'Mild';
  if (temp >= 45) return 'Cool';
  if (temp >= 35) return 'Cold';
  return 'Very Cold';
}
