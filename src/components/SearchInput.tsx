import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search for words, phrases, meanings...',
  isLoading = false,
  className,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "flex items-center bg-white rounded-full shadow-lg transition-all duration-200",
            "border-2 border-transparent hover:shadow-xl"
          )}
        >
          {/* Search Icon */}
          <Search
            className="w-5 h-5 ml-4 text-gray-400"
          />

          {/* Input Field */}
          <Input
            type="search"
            value={value}
            onChange={handleInputChange}
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
      </form>

      {/* Search Tips */}
      {!value && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Try searching for words like "sustainable", "metaverse", or "FOMO"
          </p>
        </div>
      )}
    </div>
  );
};
