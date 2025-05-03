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