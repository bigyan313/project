import React from 'react';
import { Wand2, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  onChatOpen: () => void;
  hasInteracted: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onChatOpen, hasInteracted }) => {
  return (
    <div className="bg-white p-8 flex flex-col items-center justify-center text-center h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Wand2 className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      <h3 className="text-2xl font-light text-gray-800 mb-4">
        Your AI Style Assistant
      </h3>

      <p className="text-gray-600 max-w-md mb-8 text-base font-light">
        Tell me your travel plans, and I'll curate the perfect outfits based on weather and style trends.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 w-full max-w-sm">
        <p className="text-gray-800 font-light mb-3">Try something like:</p>
        <div className="space-y-2 text-gray-600 font-light mb-6">
          <p>"I'm going to Paris next week"</p>
          <p>"Planning a trip to Miami in July"</p>
          <p>"Visiting Tokyo this winter"</p>
          <p>"VAttending Baby Shower"</p>
          <p>"Rave Party"</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 w-full max-w-sm">
  <p className="text-gray-800 font-light mb-3">Try outfits from top brands</p>
  <div className="flex flex-wrap items-center gap-3">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" 
      alt="H&M Logo"
      className="w-6 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2880px-Zara_Logo.svg.png" 
      alt="Zara Logo"
      className="w-8 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Macys_logo.svg" 
      alt="Macy's Logo"
      className="w-10 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/American_Eagle_Outfitters_wordmark.svg/2880px-American_Eagle_Outfitters_wordmark.svg.png" 
      alt="American Eagle Logo"
      className="w-12 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Coach_New_York_logo.svg/2880px-Coach_New_York_logo.svg.png" 
      alt="Coach Logo"
      className="w-6 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
      alt="Nike Logo"
      className="w-6 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Uniqlo_logo_Japanese.svg/2880px-Uniqlo_logo_Japanese.svg.png" 
      alt="uniqlo Logo"
      className="w-6 h-auto" 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Pull%26Bear_logo.svg/2880px-Pull%26Bear_logo.svg.png" 
      alt="Pull&Bear Logo"
      className="w-6 h-auto" 
    />
    
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Target_%282018%29.svg/1024px-Target_%282018%29.svg.png" 
      alt="target Logo"
      className="w-6 h-auto" 
    />
  </div>
</div>

        {!hasInteracted && (
          <button
            onClick={onChatOpen}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors text-gray-600 font-light"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Start Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;