import React, { useState, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmptyStateProps {
  onChatOpen: () => void;
  hasInteracted: boolean;
}

const rawSuggestions = [
  "Rave party",
  "Baby shower outfit",
  "Eminem Not Afraid outfit",
  "One Piece anime outfit",
  "I'm heading to Paris next week",
  "Planning a Miami beach in July",
  "Titanic movie outfits",
  "Tokyo in winter?",
];

const EmptyState: React.FC<EmptyStateProps> = ({ onChatOpen, hasInteracted }) => {
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);

  const suggestions = useMemo(
    () => [...rawSuggestions].sort((a, b) => a.length - b.length),
    []
  );

  const handleChatClick = () => {
    setSuggestionsVisible(false);
    onChatOpen();
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Gradient and Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-sky-100 to-white"></div>
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-sky-200 opacity-200 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-100 opacity-200 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full text-center space-y-10 z-10">
        {/* Animated Black & Red Gradient Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <motion.h1
            className="text-6xl  bg-clip-text text-transparent leading-tight tracking-tight animate-gradient"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #1a759a)',
              backgroundSize: '200% 200%',
              backgroundPosition: '0% 50%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.3,
              staggerChildren: 0.05,
            }}
          >
            {Array.from("WELCOME TO ADHIKARI AI").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.05 * index,
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>

          <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto font-light">
            Fashion powered by AI — inspired by travel, music, anime, and moments that define you.
          </p>
        </motion.div>

        {/* Grid Chat Suggestions */}
        <AnimatePresence>
          {suggestionsVisible && (
            <motion.div
              key="suggestions-grid"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center max-w-5xl mx-auto"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {suggestions.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.8, type: 'spring' }}
                  className="bg-white-200 text-black px-5 py-3 rounded-xl shadow max-w-xs text-sm font-normal text-center"
                >
                  {text}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Start Button */}
        <div className="mt-4">
          {!hasInteracted && (
            <motion.button
              onClick={handleChatClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black border border-gray-300 text-sm font-semibold rounded-full hover:shadow-md transition"
            >
              <MessageCircle className="h-5 w-5" />
              Start Styling with AI
            </motion.button>
          )}
        </div>

        {/* Brand Logos */}
        <div className="mt-10 text-gray-500 text-sm">Styled using top fashion platforms</div>
        <div className="flex flex-wrap items-center justify-center gap-5 opacity-80">
          {[
            { src: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", alt: "H&M" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", alt: "Zara" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Macys_logo.svg", alt: "Macy's" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/1/18/American_Eagle_Outfitters_wordmark.svg", alt: "AE" },
            { src: "https://upload.wikimedia.org/wikipedia/en/5/50/Coach_New_York_logo.svg", alt: "Coach" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Uniqlo_logo_Japanese.svg", alt: "Uniqlo" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Target_%282018%29.svg", alt: "Target" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Forever_21_logo.svg", alt: "F21" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Shein_Logo_2017.svg", alt: "Shein" },
            { src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Fashion_Nova_Logo.svg", alt: "Fashion Nova" },
          ].map((brand, idx) => (
            <img key={idx} src={brand.src} alt={brand.alt} className="h-6 hover:opacity-100 transition" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
