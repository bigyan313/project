import React from 'react';
import { Wand2, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  onChatOpen: () => void;
  hasInteracted: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onChatOpen, hasInteracted }) => {
  return (
    <div className="bg-white p-8 flex flex-col items-center justify-center text-center h-[calc(100vh-8rem)]">
      
      

      <h3 className="text-2xl font-light text-gray-800 mb-4">
        Welcome to Your AI Style Concierge
      </h3>

      <p className="text-gray-600 max-w-xl mb-8 text-base font-light leading-relaxed tracking-wide">
        Searching through endless tabs across multiple stores is exhausting. 
        <span className="font-medium text-yellow-700 ml-1">ADHIKARIAI</span> simplifies fashion discovery — matching the best outfits to your destination, occasion, and weather — so you look your best, effortlessly.
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full max-w-sm shadow-sm">
        <p className="text-yellow-700 font-medium mb-4 text-sm uppercase tracking-wider">Try something like:</p>
        
        <div className="space-y-4 text-gray-700 text-base font-light mb-8">
          <p>“I'm heading to Paris next week”</p>
          <p>“Planning a Miami beach in July”</p>
          <p>“What to wear in Tokyo this winter?”</p>
          <p>“Baby shower outfit”</p>
          <p>“Rave party”</p>
        </div>

        <p className="text-gray-800 font-light mb-4">Curated from leading brands</p>
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" alt="H&M" className="w-6 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2880px-Zara_Logo.svg.png" alt="Zara" className="w-8 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Macys_logo.svg" alt="Macy's" className="w-10 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/American_Eagle_Outfitters_wordmark.svg/2880px-American_Eagle_Outfitters_wordmark.svg.png" alt="American Eagle" className="w-20 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Coach_New_York_logo.svg/2880px-Coach_New_York_logo.svg.png" alt="Coach" className="w-10 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Uniqlo_logo_Japanese.svg/2880px-Uniqlo_logo_Japanese.svg.png" alt="Uniqlo" className="w-6 h-auto" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Target_%282018%29.svg/1024px-Target_%282018%29.svg.png" alt="Target" className="w-6 h-auto" />
        </div>

        {!hasInteracted && (
          <button
            onClick={onChatOpen}
            className="mt-8 w-full flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:shadow transition-all text-gray-700 font-light"
          >
            <MessageCircle className="h-5 w-5 text-yellow-600" />
            <span>Start Your AI Style</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
