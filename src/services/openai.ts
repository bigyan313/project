import OpenAI from 'openai';
import { format } from 'date-fns';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ExtractedInfo {
  type: 'travel' | 'event';
  destination?: string;
  date?: string;
  event?: string;
}

export async function extractTravelInfo(message: string): Promise<ExtractedInfo> {
  const systemPrompt = `You are a fashion AI assistant. Extract either travel information or event type from the user's message and return it in JSON format.

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

Expected JSON format for travel:
{
  "type": "travel",
  "destination": "city or location",
  "date": "YYYY-MM-DD"
}

Expected JSON format for events:
{
  "type": "event",
  "event": "specific event type from the list above"
}`;

  if (!message.trim()) {
    throw new Error('Please provide a travel destination or event type');
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
      throw new Error('Please provide more details about your travel plans or event');
    }

    let result: ExtractedInfo;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Could not understand your request. Please try being more specific about your travel plans or event type');
    }

    if (!result.type || !['travel', 'event'].includes(result.type)) {
      throw new Error('Please specify either a travel destination with date or an event type');
    }

    if (result.type === 'travel') {
      if (!result.destination) {
        throw new Error('Please specify a destination for your travel plans');
      }
      if (!result.date) {
        throw new Error('Please specify when you plan to travel');
      }
    } else if (result.type === 'event') {
      if (!result.event) {
        throw new Error('Please specify what type of event you\'re attending');
      }
    }

    return result;
  } catch (error: any) {
    console.error('Error in extractTravelInfo:', error);

    if (error instanceof SyntaxError) {
      throw new Error('Could not understand your request. Please try being more specific about your travel plans or event type');
    }

    if (error.message) {
      throw error;
    }

    throw new Error('Failed to process your request. Please try rephrasing with more specific details about your travel or event');
  }
}

export async function generateOutfitSuggestions(params: { weather?: any; event?: string }): Promise<any[]> {
  const { weather, event } = params;
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
  }

  prompt += `\n\nReturn a valid JSON array with exactly 4 outfit objects. Each object must have:
{
  "type": "Fashionable outfit name",
  "description": "Top: [details], Bottom: [details], Shoes: [details], Accessories: [details]",
  "searchQuery": "Main item search term",
  "imagePrompt": "Brief photo description"
}

CRITICAL: 
- Use clear, specific clothing terms
- Include color for each item
- Separate items with commas
- Format description with clear labels (Top:, Bottom:, etc.)
- No trailing commas in JSON
- Keep descriptions detailed but easy to understand`;

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