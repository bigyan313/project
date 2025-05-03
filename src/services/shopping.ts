import { Product } from '../types';

const STORES = [
  'macys.com',
  'target.com',
  'forever21.com',
  'hm.com',
  'zara.com',
  'asos.com'
];

async function getUnsplashImage(query: string, imagePrompt?: string): Promise<string> {
  try {
    // Use the specific image prompt if available, otherwise use the query
    const searchQuery = imagePrompt 
      ? `${imagePrompt} outfit`
      : `${query} fashion outfit style`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&orientation=portrait&per_page=5`,
      {
        headers: {
          'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Randomly select one of the top 5 images to ensure variety
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
      return data.results[randomIndex].urls.regular;
    }
    throw new Error('No images found');
  } catch (error) {
    console.error('Unsplash API error:', error);
    // Fallback to dynamic Unsplash URL with randomized query
    const fallbackQuery = `${query} fashion outfit style ${Math.random()}`;
    return `https://source.unsplash.com/400x600/?${encodeURIComponent(fallbackQuery)}`;
  }
}

async function getFallbackProducts(outfit: any): Promise<Product[]> {
  const { searchQuery, imagePrompt, type } = outfit;
  
  // Get a unique image using both the search query and image prompt
  const image = await getUnsplashImage(searchQuery, imagePrompt);
  
  return [{
    title: type || 'Style Suggestion',
    link: '#',
    image,
    price: '$29.99 - $99.99',
    store: 'Style',
    description: outfit.description || 'AI-curated style suggestion'
  }];
}

export async function searchProducts(outfit: any): Promise<Product[]> {
  try {
    const siteRestriction = `(${STORES.map(site => `site:${site}`).join(' OR ')})`;
    const enhancedQuery = `${outfit.searchQuery} clothing ${siteRestriction}`;

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', import.meta.env.VITE_GOOGLE_API_KEY);
    url.searchParams.append('cx', import.meta.env.VITE_GOOGLE_CSE_ID);
    url.searchParams.append('q', enhancedQuery);
    url.searchParams.append('num', '4');
    url.searchParams.append('gl', 'us');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.log('Falling back to Unsplash images due to API error');
      return getFallbackProducts(outfit);
    }

    const data = await response.json();
    if (!data.items) {
      return getFallbackProducts(outfit);
    }

    return Promise.all(data.items.map(async (item: any) => {
      const storeMatch = item.link.match(/(?:www\.)?([\w-]+)\.com/);
      const storeDomain = storeMatch ? storeMatch[1].toLowerCase() : '';
      const storeNames: Record<string, string> = {
        macys: "M",
        target: 'T',
        forever21: 'F21',
        hm: 'H&M',
        zara: 'Z',
        asos: 'A'
      };
      const store = storeNames[storeDomain] || 'Shop';

      const priceMatch =
        item.pagemap?.offer?.[0]?.price ||
        item.pagemap?.product?.[0]?.price ||
        item.title.match(/\$\d+(?:\.\d{2})?/) ||
        item.snippet.match(/\$\d+(?:\.\d{2})?/);

      const price =
        typeof priceMatch === 'string' ? priceMatch :
        priceMatch ? `$${priceMatch}` :
        'Price N/A';

      const image =
        item.pagemap?.cse_image?.[0]?.src ||
        item.pagemap?.cse_thumbnail?.[0]?.src ||
        item.pagemap?.product?.[0]?.image;

      // If no product image is found, use Unsplash with the specific image prompt
      if (!image) {
        const unsplashImage = await getUnsplashImage(outfit.searchQuery, outfit.imagePrompt);
        
        return {
          title: item.title.split(/[|\-]/)[0].trim(),
          link: item.link,
          image: unsplashImage,
          price,
          store,
          description: item.snippet
        };
      }

      return {
        title: item.title.split(/[|\-]/)[0].trim(),
        link: item.link,
        image,
        price,
        store,
        description: item.snippet
      };
    }));
  } catch (error: any) {
    console.error('Product search error:', error);
    return getFallbackProducts(outfit);
  }
}