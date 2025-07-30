import { dictionaryApi, handleApiResponse, handleApiError } from './api';
import type { WordDefinition, SearchResult, SearchFilters } from '@/types';

export class DictionaryService {
  // Search for word definitions using Free Dictionary API
  static async searchWord(word: string): Promise<WordDefinition[]> {
    try {
      const response = await dictionaryApi.get(`/entries/en/${encodeURIComponent(word.toLowerCase())}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Get word suggestions for autocomplete
  static async getWordSuggestions(query: string): Promise<string[]> {
    try {
      // Using a simple approach with common word patterns
      const suggestions = await this.generateSuggestions(query);
      return suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  // Generate search suggestions based on query
  private static async generateSuggestions(query: string): Promise<string[]> {
    const commonWords = [
      'hello', 'world', 'computer', 'internet', 'technology', 'science',
      'nature', 'environment', 'sustainable', 'innovation', 'creativity',
      'communication', 'education', 'knowledge', 'wisdom', 'understanding',
      'friendship', 'relationship', 'community', 'society', 'culture',
      'art', 'music', 'literature', 'philosophy', 'psychology',
      'happiness', 'success', 'achievement', 'motivation', 'inspiration',
      'challenge', 'opportunity', 'growth', 'development', 'progress',
      'future', 'past', 'present', 'time', 'space', 'universe',
      'beautiful', 'amazing', 'wonderful', 'incredible', 'fantastic',
      'important', 'significant', 'valuable', 'useful', 'helpful'
    ];

    return commonWords
      .filter(word => word.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }

  // Transform API response to SearchResult format
  static transformToSearchResults(definitions: WordDefinition[]): SearchResult[] {
    const results: SearchResult[] = [];

    definitions.forEach((wordDef) => {
      wordDef.meanings.forEach((meaning, meaningIndex) => {
        meaning.definitions.forEach((def, defIndex) => {
          results.push({
            id: `${wordDef.word}-${meaningIndex}-${defIndex}`,
            word: wordDef.word,
            definition: def.definition,
            partOfSpeech: meaning.partOfSpeech,
            example: def.example,
            synonyms: def.synonyms || meaning.synonyms,
            antonyms: def.antonyms || meaning.antonyms,
            phonetic: wordDef.phonetic || wordDef.phonetics[0]?.text,
            audio: wordDef.phonetics.find(p => p.audio)?.audio,
            relevanceScore: 1.0 - (meaningIndex * 0.1) - (defIndex * 0.05),
          });
        });
      });
    });

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Search with filters
  static async searchWithFilters(
    query: string, 
    filters?: SearchFilters
  ): Promise<SearchResult[]> {
    try {
      const definitions = await this.searchWord(query);
      let results = this.transformToSearchResults(definitions);

      // Apply filters
      if (filters) {
        results = this.applyFilters(results, filters);
      }

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  // Apply search filters
  private static applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    let filteredResults = [...results];

    if (filters.partOfSpeech && filters.partOfSpeech.length > 0) {
      filteredResults = filteredResults.filter(result =>
        filters.partOfSpeech!.includes(result.partOfSpeech)
      );
    }

    if (filters.hasAudio) {
      filteredResults = filteredResults.filter(result => result.audio);
    }

    if (filters.hasExample) {
      filteredResults = filteredResults.filter(result => result.example);
    }

    return filteredResults;
  }

  // Get trending words (mock implementation)
  static async getTrendingWords(): Promise<string[]> {
    // In a real app, this would come from analytics/backend
    return [
      'sustainable', 'metaverse', 'NFT', 'cryptocurrency', 'blockchain',
      'artificial intelligence', 'machine learning', 'quantum computing',
      'climate change', 'renewable energy', 'biodiversity', 'ecosystem',
      'mindfulness', 'wellness', 'productivity', 'innovation', 'disruption',
      'digital transformation', 'remote work', 'hybrid', 'collaboration',
      'authenticity', 'transparency', 'accountability', 'inclusivity',
      'diversity', 'equity', 'empowerment', 'resilience', 'adaptability'
    ];
  }

  // Get word of the day
  static async getWordOfTheDay(): Promise<{ word: string; definition: string; example?: string }> {
    const words = [
      {
        word: 'Sonder',
        definition: 'The realization that each random passerby is living a life as vivid and complex as your own.',
        example: 'Walking through the busy street, she experienced a moment of sonder.'
      },
      {
        word: 'Petrichor',
        definition: 'The pleasant earthy smell after rain.',
        example: 'The petrichor filled the air after the summer storm.'
      },
      {
        word: 'Serendipity',
        definition: 'The occurrence of events by chance in a happy or beneficial way.',
        example: 'Meeting her future business partner at the coffee shop was pure serendipity.'
      },
      {
        word: 'Ephemeral',
        definition: 'Lasting for a very short time.',
        example: 'The beauty of cherry blossoms is ephemeral but unforgettable.'
      },
      {
        word: 'Wanderlust',
        definition: 'A strong desire to travel and explore the world.',
        example: 'Her wanderlust led her to visit over thirty countries.'
      }
    ];

    const today = new Date().getDay();
    return words[today % words.length];
  }

  // Check if word exists
  static async wordExists(word: string): Promise<boolean> {
    try {
      await this.searchWord(word);
      return true;
    } catch {
      return false;
    }
  }
}
