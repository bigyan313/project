import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white">
      <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-[1920px] relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-3xl font-light tracking-widest text-black">ADHIKARI</h1>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 bg-white/10 py-1 px-3 rounded-full text-sm">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="font-light text-white">AI-Powered</span>
        </div>
      </div>
    </header>
  );
}

export default Header;