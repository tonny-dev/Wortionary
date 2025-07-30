import React, { memo, useCallback, useId, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchProps } from '@/types';
import { cn, getAriaLabel, sanitizeInput, isValidSearchQuery } from '@/lib/utils';

const SearchInput = memo<SearchProps>(({ 
  initialValue = '', 
  onSearch, 
  placeholder = 'Type to search...', 
  isLoading = false 
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const searchId = useId();
  const errorId = useId();
  
  const isValid = isValidSearchQuery(value);
  const showError = value.length > 0 && !isValid && !isFocused;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setValue(sanitizedValue);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSearch(value.trim());
    }
  }, [value, isValid, isLoading, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} role="search" className="relative">
        <div 
          className={cn(
            "flex items-center bg-white px-4 py-3 rounded-full shadow-lg transition-all duration-200",
            "border-2 border-transparent",
            isFocused && "ring-2 ring-blue-500 ring-opacity-50",
            showError && "border-red-500"
          )}
        >
          {/* Search Icon */}
          <Search 
            className={cn(
              "w-5 h-5 mr-3 transition-colors duration-200",
              isFocused ? "text-blue-600" : "text-gray-400"
            )} 
            aria-hidden="true"
          />

          {/* Input Field */}
          <Input
            id={searchId}
            type="search"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-500",
              "focus:ring-0 focus:outline-none text-base sm:text-lg",
              "disabled:opacity-50"
            )}
            aria-label={getAriaLabel("Search", "for words and phrases")}
            aria-describedby={showError ? errorId : undefined}
            aria-invalid={showError}
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
              className="p-1 h-auto min-w-0 text-gray-400 hover:text-gray-600 mr-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <Loader2 
              className="w-5 h-5 mr-3 text-blue-600 animate-spin" 
              aria-hidden="true"
            />
          )}

          {/* Search Button */}
          <Button 
            type="submit"
            disabled={!isValid || isLoading}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full",
              "transition-all duration-200 font-medium",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
            aria-label={isLoading ? "Searching..." : "Search"}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Error Message */}
        {showError && (
          <div 
            id={errorId}
            className="mt-2 text-sm text-red-600 px-4"
            role="alert"
            aria-live="polite"
          >
            Please enter at least 2 characters to search.
          </div>
        )}
      </form>

      {/* Search Tips */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-300">
          Try searching for words like "sustainable", "metaverse", or "FOMO"
        </p>
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export { SearchInput };
