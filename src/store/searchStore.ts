import { create } from 'zustand';
import type { SearchState, SearchFilters } from '@/types';
import { DictionaryService } from '@/services/dictionaryService';

interface SearchStore extends SearchState {
  // Actions
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
  getSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  setFilters: (filters: SearchFilters) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  // Initial state
  query: '',
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  totalResults: 0,
  currentPage: 1,
  suggestions: [],

  // Actions
  search: async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      set({ results: [], hasSearched: false, error: null });
      return;
    }

    set({ 
      isLoading: true, 
      error: null, 
      query: query.trim(),
      hasSearched: true 
    });

    try {
      const results = await DictionaryService.searchWithFilters(query.trim(), filters);
      
      set({
        results,
        totalResults: results.length,
        isLoading: false,
        error: null,
        currentPage: 1,
      });

      // Add to search history
      get().addToHistory(query.trim());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({
        results: [],
        totalResults: 0,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  clearSearch: () => {
    set({
      query: '',
      results: [],
      error: null,
      hasSearched: false,
      totalResults: 0,
      currentPage: 1,
      suggestions: [],
    });
  },

  setQuery: (query: string) => {
    set({ query });
  },

  getSuggestions: async (query: string) => {
    if (!query.trim() || query.length < 2) {
      set({ suggestions: [] });
      return;
    }

    try {
      const suggestions = await DictionaryService.getWordSuggestions(query.trim());
      set({ suggestions });
    } catch (error) {
      set({ suggestions: [] });
    }
  },

  clearSuggestions: () => {
    set({ suggestions: [] });
  },

  setFilters: (filters: SearchFilters) => {
    // Re-search with new filters if we have a query
    const { query, search } = get();
    if (query) {
      search(query, filters);
    }
  },

  addToHistory: (query: string) => {
    // In a real app, this would persist to backend/localStorage
    // For now, we'll just track in memory
    console.log('Added to search history:', query);
  },

  clearHistory: () => {
    // Clear search history
    console.log('Search history cleared');
  },
}));
