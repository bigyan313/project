import React from 'react';
import { OutfitItem } from '../types';
import OutfitCard from './OutfitCard';
import { Sparkles } from 'lucide-react';

interface OutfitSuggestionsProps {
  outfits: OutfitItem[];
}

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ outfits }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-xl font-semibold text-black">
          AI-Curated Outfits
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {outfits.map((outfit, index) => (
          <OutfitCard key={index} outfit={outfit} />
        ))}
      </div>
    </div>
  );
};

export default OutfitSuggestions