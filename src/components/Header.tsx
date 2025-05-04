import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white shadow-sm">
      <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-[1920px] relative">
        
        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none flex items-center space-x-1">
          <span className="text-4xl font-medium tracking-tight text-black">A</span>
          <span className="text-[9px] font-light tracking-[0.2em] text-gray-600">DHIKAR</span>
          <span className="text-4xl font-medium tracking-tight text-black">I</span>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Tagline */}
        <div className="flex items-center gap-2 bg-gray-100 py-1 px-3 rounded-full text-sm shadow">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="font-light text-gray-700">AI-Powered</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
