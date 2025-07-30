import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TagList } from '@/components/TagList';
import { WordOfTheDay } from '@/components/WordOfTheDay';
import { SearchStats } from '@/components/SearchStats';
import { useSearchStore } from '@/store/searchStore';
import { useAuthStore } from '@/store/authStore';
import { DictionaryService } from '@/services/dictionaryService';
import type { Tag } from '@/types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useSearchStore();
  const { user } = useAuthStore();
  
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [personalTags, setPersonalTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Load trending and personal tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoadingTags(true);
        
        // Load trending words
        const trendingWords = await DictionaryService.getTrendingWords();
        const trending = trendingWords.slice(0, 12).map((word, index) => ({
          id: `trending-${index}`,
          label: word,
          category: 'trending' as const,
          count: Math.floor(Math.random() * 1000) + 100,
        }));

        // Mock personal tags based on user preferences
        const personal: Tag[] = [
          { id: 'p1', label: 'Technology', category: 'personal', count: 45 },
          { id: 'p2', label: 'Science', category: 'personal', count: 32 },
          { id: 'p3', label: 'Art', category: 'personal', count: 28 },
          { id: 'p4', label: 'Philosophy', category: 'personal', count: 21 },
          { id: 'p5', label: 'Psychology', category: 'personal', count: 19 },
          { id: 'p6', label: 'Literature', category: 'personal', count: 15 },
          { id: 'p7', label: 'Music', category: 'personal', count: 12 },
          { id: 'p8', label: 'Nature', category: 'personal', count: 10 },
        ];

        setTrendingTags(trending);
        setPersonalTags(personal);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  const handleSearch = async (query: string) => {
    await search(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: Tag) => {
    handleSearch(tag.label);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header 
        user={user ? {
          name: `${user.firstName} ${user.lastName}`,
          initials: `${user.firstName[0]}${user.lastName[0]}`,
          avatar: user.avatar
        } : undefined}
      />

      {/* Hero Section */}
      <HeroSection 
        onSearch={handleSearch}
        title="Search for words, phrases and meanings"
        subtitle="Discover the meaning behind modern language, slang, and trending terms"
      />

      {/* Word of the Day */}
      <WordOfTheDay />

      {/* Tag Lists */}
      <TagList 
        title="Trending" 
        tags={trendingTags} 
        onTagClick={handleTagClick}
        isLoading={isLoadingTags}
        showAddButton={false}
        maxVisible={12}
      />
      
      <TagList 
        title="For you" 
        tags={personalTags} 
        onTagClick={handleTagClick}
        isLoading={isLoadingTags}
        showAddButton={true}
        maxVisible={8}
      />

      {/* Additional Content Sections */}
      <section className="mt-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Popular Categories */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Technology', count: 1250 },
                { name: 'Social Media', count: 980 },
                { name: 'Business', count: 756 },
                { name: 'Culture', count: 642 },
                { name: 'Science', count: 534 },
              ].map((category) => (
                <li key={category.name} className="flex justify-between items-center">
                  <button
                    onClick={() => handleSearch(category.name)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    {category.name}
                  </button>
                  <span className="text-gray-500 text-sm">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Search Stats */}
          <SearchStats />

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="text-white font-medium">View Profile</div>
                <div className="text-gray-400 text-sm">Manage your account settings</div>
              </button>
              
              <button
                onClick={() => handleSearch('random')}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="text-white font-medium">Random Word</div>
                <div className="text-gray-400 text-sm">Discover something new</div>
              </button>
              
              <button
                onClick={() => navigate('/search?filter=saved')}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="text-white font-medium">Saved Words</div>
                <div className="text-gray-400 text-sm">Review your collection</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="text-center py-8">
            <p className="text-gray-400">
              Start searching to see your recent activity here
            </p>
            <button
              onClick={() => handleSearch('hello')}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Try a search
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Wortionary</h3>
              <p className="text-gray-400 text-sm">
                Your comprehensive dictionary for modern language, slang, and trending terms.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Word Search</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trending Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Personal Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Audio Pronunciation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bug Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DMCA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Wortionary. Made with ❤️ for modern language exploration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
