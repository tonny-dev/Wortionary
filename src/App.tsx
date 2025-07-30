import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Mock user data
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  username: 'demo_user',
  firstName: 'Alex',
  lastName: 'Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
  createdAt: new Date().toISOString(),
};

// Dictionary API service
const searchWord = async (word: string) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    if (!response.ok) {
      throw new Error('Word not found');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to search word');
  }
};

// Authentication component
const AuthPage: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'password123',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isLogin) {
      // Login validation
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        toast.success(`Welcome back, ${DEMO_USER.firstName}!`);
        onLogin(DEMO_USER);
      } else {
        toast.error('Invalid credentials. Use demo@example.com / password123');
      }
    } else {
      // Registration validation
      if (formData.firstName && formData.lastName && formData.email && formData.password === formData.confirmPassword) {
        const newUser = {
          ...DEMO_USER,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          id: Date.now().toString(),
        };
        toast.success(`Welcome to Wortionary, ${newUser.firstName}!`);
        onLogin(newUser);
      } else {
        toast.error('Please fill all fields correctly');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[url('/task1/hero-bg.png')] bg-cover bg-center opacity-10" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/task1/logo.png" 
              alt="Wortionary logo" 
              className="w-12 h-12"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <h1 className="text-3xl font-bold text-white">Wortionary</h1>
          </div>
          <p className="text-gray-400">Your comprehensive dictionary for modern language</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Join Wortionary today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isLogin}
              />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {isLogin && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 text-sm mb-2">Demo credentials:</p>
                <p className="text-gray-400 text-xs">Email: demo@example.com</p>
                <p className="text-gray-400 text-xs">Password: password123</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main HomePage component
const HomePage: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await searchWord(query.trim());
      setSearchResults(results);
      toast.success(`Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`);
    } catch (error) {
      setSearchResults([]);
      toast.error(`No results found for "${query}". Try a different word.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img 
            src="/task1/logo.png" 
            alt="Wortionary logo" 
            className="w-8 h-8 sm:w-10 sm:h-10"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <div className="text-white font-semibold text-base sm:text-lg">Wortionary</div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - Hidden on mobile, visible on sm and up */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-800 text-white border-gray-700 placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-600"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`;
                }}
              />
              <span className="text-sm text-gray-300 hidden sm:block">{user.firstName}</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded">
                    Saved Words
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded">
                    Search History
                  </button>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden mt-8">
        <div className="relative h-96">
          <img 
            src="/task1/hero-bg.png" 
            alt="Hero background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight">
            Search for words, phrases and meanings
          </h1>

          <div className="w-full max-w-2xl">
            <div className="flex items-center bg-white rounded-full shadow-lg p-2">
              <svg className="w-5 h-5 ml-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search for words, phrases, meanings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:outline-none text-lg px-4 py-3"
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="mt-8 px-6 max-w-6xl mx-auto">
          <h2 className="text-white text-xl font-semibold mb-6">
            {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
          </h2>
          
          {isSearching && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isSearching && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found. Try a different word.</p>
            </div>
          )}
          
          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((wordData, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-400 mb-2">{wordData.word}</h3>
                      {wordData.phonetic && (
                        <p className="text-gray-400 text-sm mb-2">{wordData.phonetic}</p>
                      )}
                    </div>
                    {wordData.phonetics?.find((p: any) => p.audio) && (
                      <button
                        onClick={() => {
                          const audio = new Audio(wordData.phonetics.find((p: any) => p.audio)?.audio);
                          audio.play();
                        }}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {wordData.meanings?.map((meaning: any, meaningIndex: number) => (
                    <div key={meaningIndex} className="mb-4">
                      <span className="inline-block px-2 py-1 bg-gray-800 text-blue-400 text-sm rounded mb-2">
                        {meaning.partOfSpeech}
                      </span>
                      {meaning.definitions?.slice(0, 2).map((def: any, defIndex: number) => (
                        <div key={defIndex} className="mb-3">
                          <p className="text-gray-300 mb-2">{def.definition}</p>
                          {def.example && (
                            <p className="text-gray-500 italic text-sm">"{def.example}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tags Section */}
      <section className="mt-8 px-6 max-w-6xl mx-auto">
        <h2 className="text-white text-xl font-semibold mb-6">Trending</h2>
        <div className="flex flex-wrap gap-3">
          {['hello', 'world', 'love', 'peace', 'freedom', 'justice', 'hope', 'dream'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer px-4 py-2 rounded-full transition-colors border border-gray-700 hover:border-gray-600"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-6 max-w-6xl mx-auto">
        <h2 className="text-white text-xl font-semibold mb-6">For you</h2>
        <div className="flex flex-wrap gap-3">
          {['beautiful', 'amazing', 'wonderful', 'incredible', 'fantastic', 'awesome'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer px-4 py-2 rounded-full transition-colors border border-gray-700 hover:border-gray-600"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Wortionary. Made with ❤️ for modern language exploration.
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('wortionary_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('wortionary_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('wortionary_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wortionary_user');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Wortionary...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="bg-black min-h-screen text-white">
          <Routes>
            <Route 
              path="/" 
              element={
                user ? (
                  <HomePage user={user} onLogout={handleLogout} />
                ) : (
                  <AuthPage onLogin={handleLogin} />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f9fafb',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f9fafb',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
