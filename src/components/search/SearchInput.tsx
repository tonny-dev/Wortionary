import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2, Filter, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInputProps, SearchFilters } from '@/types';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/searchStore';

export const SearchInput: React.FC<SearchInputProps> = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search for words, phrases, meanings...',
  isLoading = false,
  suggestions = [],
  showFilters = true,
  className,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { getSuggestions, clearSuggestions } = useSearchStore();

  // Debounced suggestions
  const debouncedGetSuggestions = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        getSuggestions(query);
      } else {
        clearSuggestions();
      }
    }, 300),
    [getSuggestions, clearSuggestions]
  );

  useEffect(() => {
    if (value && isFocused) {
      debouncedGetSuggestions(value);
    }
  }, [value, isFocused, debouncedGetSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim(), filters);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    onSearch(suggestion, filters);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setValue('');
    setShowSuggestions(false);
    clearSuggestions();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (value.trim()) {
      onSearch(value.trim(), newFilters);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "flex items-center bg-white rounded-full shadow-lg transition-all duration-200",
            "border-2 border-transparent",
            isFocused && "ring-2 ring-blue-500 ring-opacity-50",
            "hover:shadow-xl"
          )}
        >
          {/* Search Icon */}
          <Search
            className={cn(
              "w-5 h-5 ml-4 transition-colors duration-200",
              isFocused ? "text-blue-600" : "text-gray-400"
            )}
          />

          {/* Input Field */}
          <Input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (value && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding suggestions to allow clicks
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-500",
              "focus:ring-0 focus:outline-none text-base sm:text-lg px-4 py-4",
              "disabled:opacity-50"
            )}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Voice Search Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600 mr-2"
            title="Voice search"
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Filters Button */}
          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={cn(
                "p-2 mr-2 relative",
                activeFiltersCount > 0 ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
              title="Search filters"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-blue-600 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Clear Button */}
          {value && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 mr-2"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <Loader2 className="w-5 h-5 mr-4 text-blue-600 animate-spin" />
          )}

          {/* Search Button */}
          <Button
            type="submit"
            disabled={!value.trim() || isLoading}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full mr-1",
              "transition-all duration-200 font-medium",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Filters Panel */}
      {showFiltersPanel && (
        <SearchFiltersPanel
          filters={filters}
          onFiltersChange={handleFilterChange}
          onClose={() => setShowFiltersPanel(false)}
        />
      )}

      {/* Search Tips */}
      {!value && !isFocused && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Try searching for words like "sustainable", "metaverse", or "FOMO"
          </p>
        </div>
      )}
    </div>
  );
};

// Search Filters Panel Component
interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const SearchFiltersPanel: React.FC<SearchFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const partsOfSpeech = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'];

  const handlePartOfSpeechToggle = (pos: string) => {
    const current = filters.partOfSpeech || [];
    const updated = current.includes(pos)
      ? current.filter(p => p !== pos)
      : [...current, pos];
    
    onFiltersChange({ ...filters, partOfSpeech: updated });
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-40 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Part of Speech */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Part of Speech
          </label>
          <div className="flex flex-wrap gap-2">
            {partsOfSpeech.map((pos) => (
              <Badge
                key={pos}
                variant={filters.partOfSpeech?.includes(pos) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePartOfSpeechToggle(pos)}
              >
                {pos}
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasAudio || false}
              onChange={(e) => onFiltersChange({ ...filters, hasAudio: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Has audio pronunciation</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasExample || false}
              onChange={(e) => onFiltersChange({ ...filters, hasExample: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Has examples</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
