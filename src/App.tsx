import React, { useState, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import ResultsPanel from './components/ResultsPanel';
import Header from './components/Header';
import { TravelPlan } from './types';
import { extractTravelInfo, generateOutfitSuggestions } from './services/openai';
import { getWeatherForecast } from './services/weather';
import { searchProducts } from './services/shopping';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsChatOpen(false);
    }
  }, [isLoading]);

  const handleChatSubmit = async (message: string) => {
    if (!hasInteracted) setHasInteracted(true);
    setIsLoading(true);
    
    try {
      const info = await extractTravelInfo(message);
      
      if (info.type === 'travel') {
        const weatherData = await getWeatherForecast(info.destination!, info.date!);
        const warning = weatherData.warning;
        
        const outfitSuggestions = await generateOutfitSuggestions({ weather: weatherData });
        
        const outfitsWithProducts = await Promise.all(
          outfitSuggestions.map(async (outfit: any) => ({
            ...outfit,
            products: await searchProducts(outfit)
          }))
        );
        
        setTravelPlan({
          id: Math.random().toString(36).substring(2, 9),
          destination: info.destination!,
          date: weatherData.date,
          weather: weatherData,
          outfits: outfitsWithProducts,
          status: warning ? 'warning' : 'success',
          warning,
          type: 'travel'
        });
      } else {
        const outfitSuggestions = await generateOutfitSuggestions({ event: info.event });
        
        const outfitsWithProducts = await Promise.all(
          outfitSuggestions.map(async (outfit: any) => ({
            ...outfit,
            products: await searchProducts(outfit)
          }))
        );
        
        setTravelPlan({
          id: Math.random().toString(36).substring(2, 9),
          event: info.event!,
          outfits: outfitsWithProducts,
          status: 'success',
          type: 'event'
        });
      }
    } catch (error: any) {
      console.error('Error processing request:', error);
      setTravelPlan({
        id: Math.random().toString(36).substring(2, 9),
        status: 'error',
        error: error.message || 'Failed to process your request. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-[1920px] min-h-[calc(100vh-4rem)]">
        <div className="w-full h-full">
          <ResultsPanel 
            travelPlan={travelPlan} 
            isLoading={isLoading} 
            onChatOpen={toggleChat}
            hasInteracted={hasInteracted}
          />
        </div>

        {hasInteracted && (
          <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white shadow-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {isChatOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <MessageCircle className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-40 w-full max-w-md"
            >
              <ChatPanel 
                onSubmit={handleChatSubmit} 
                isLoading={isLoading}
                travelPlan={travelPlan}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;