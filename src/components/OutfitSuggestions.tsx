import React from 'react';
import { OutfitItem } from '../types';
import OutfitCard from './OutfitCard';
import {
  Sparkles,
  Sun,
  Moon,
  Briefcase,
  Heart,
  Gift,
  Umbrella,
  User,
  UserRound,
} from 'lucide-react';

interface OutfitSuggestionsProps {
  outfits: OutfitItem[];
}

const iconTags = [
  { icon: User, color: 'bg-blue-10 text-blue-600', title: 'Men' },
  { icon: UserRound, color: 'bg-pink-10 text-pink-600', title: 'Female' },
  { icon: Sun, color: 'bg-yellow-10 text-yellow-600', title: 'Day' },
  { icon: Moon, color: 'bg-indigo-10 text-indigo-600', title: 'Night' },
  { icon: Umbrella, color: 'bg-cyan-10 text-cyan-600', title: 'Beach' },
  { icon: Gift, color: 'bg-red-10 text-red-500', title: 'Birthday' },
  { icon: Heart, color: 'bg-rose-10 text-rose-500', title: 'Date' },
  { icon: Briefcase, color: 'bg-gray-10 text-gray-600', title: 'Business' },
];

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ outfits }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-semibold text-black">AI-Curated Outfits</h3>
        </div>

        {/* Vector-style icon badges */}
        <div className="flex items-center gap-2">
          {iconTags.map(({ icon: Icon, color, title }, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}
              title={title}
            >
              <Icon className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {outfits.map((outfit, index) => (
          <OutfitCard
            key={index}
            outfit={outfit}
            onRefresh={async (outfitId: string) => {
              console.log(`Refreshing outfit with ID: ${outfitId}`);
              // Add your refresh logic here
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OutfitSuggestions;
