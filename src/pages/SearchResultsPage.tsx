import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SearchInput } from '@/components/search/SearchInput';
import { useSearchStore } from '@/store/searchStore';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Volume2, BookOpen, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const { 
    search, 
    results, 
    isLoading, 
    error, 
    hasSearched, 
    totalResults 
  } = useSearchStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleWordClick = (word: string) => {
    navigate(`/word/${encodeURIComponent(word)}`);
  };

  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        user={user ? {
          name: `${user.firstName} ${user.lastName}`,
          initials: `${user.firstName[0]}${user.lastName[0]}`,
          avatar: user.avatar
        } : undefined}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Input */}
        <div className="mb-8">
          <SearchInput
            initialValue={query}
            onSearch={handleSearch}
            isLoading={isLoading}
            showFilters={true}
          />
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Searching..." />
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 mb-8">
            <h3 className="text-red-400 font-semibold mb-2">Search Error</h3>
            <p className="text-red-300">{error}</p>
            <Button
              onClick={() => search(query)}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {hasSearched && !isLoading && !error && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-400">
                {totalResults === 0 
                  ? 'No results found' 
                  : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`
                }
              </p>
            </div>

            {/* No Results */}
            {results.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any definitions for "{query}". Try a different search term.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Suggestions:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['hello', 'world', 'technology', 'science'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(suggestion)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 && (
              <div className="space-y-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => handleWordClick(result.word)}
                            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {result.word}
                          </button>
                          
                          {result.phonetic && (
                            <span className="text-gray-400 text-sm">
                              {result.phonetic}
                            </span>
                          )}
                          
                          <Badge variant="outline" className="text-xs">
                            {result.partOfSpeech}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                          {result.definition}
                        </p>
                        
                        {result.example && (
                          <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500 mb-4">
                            <p className="text-gray-400 text-sm mb-1">Example:</p>
                            <p className="text-gray-200 italic">"{result.example}"</p>
                          </div>
                        )}
                        
                        {(result.synonyms && result.synonyms.length > 0) && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-2">Synonyms:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.synonyms.slice(0, 5).map((synonym, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSearch(synonym)}
                                  className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 transition-colors"
                                >
                                  {synonym}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePronounce(result.word)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Pronounce
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => handleWordClick(result.word)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start your search
            </h3>
            <p className="text-gray-400">
              Enter a word or phrase above to begin exploring definitions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
