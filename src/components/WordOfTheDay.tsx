import React, { useEffect, useState } from 'react';
import { Volume2, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DictionaryService } from '@/services/dictionaryService';

interface WordOfDay {
  word: string;
  definition: string;
  example?: string;
}

export const WordOfTheDay: React.FC = () => {
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWordOfDay = async () => {
      try {
        const word = await DictionaryService.getWordOfTheDay();
        setWordOfDay(word);
      } catch (error) {
        console.error('Failed to load word of the day:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWordOfDay();
  }, []);

  const handleShare = () => {
    if (wordOfDay && navigator.share) {
      navigator.share({
        title: `Word of the Day: ${wordOfDay.word}`,
        text: `${wordOfDay.word}: ${wordOfDay.definition}`,
        url: window.location.href,
      });
    }
  };

  const handlePronounce = () => {
    if (wordOfDay && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordOfDay.word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <section className="mt-8 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-gray-800">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-32 mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!wordOfDay) {
    return null;
  }

  return (
    <section className="mt-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
              Word of the Day
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePronounce}
                className="text-gray-400 hover:text-white p-2"
                title="Pronounce word"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-white p-2"
                title="Share word"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-400">
              {wordOfDay.word}
            </h3>
            
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {wordOfDay.definition}
            </p>
            
            {wordOfDay.example && (
              <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-400 text-sm mb-1">Example:</p>
                <p className="text-gray-200 italic">"{wordOfDay.example}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
