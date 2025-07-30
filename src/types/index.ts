// Authentication types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  searchHistory: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  acceptTerms: boolean;
}

// Dictionary API types
export interface WordDefinition {
  id: string;
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: License;
  sourceUrls?: string[];
  origin?: string;
}

export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: License;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface Definition {
  definition: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
}

export interface License {
  name: string;
  url: string;
}

// Search types
export interface SearchResult {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
  phonetic?: string;
  audio?: string;
  relevanceScore: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  suggestions: string[];
}

export interface SearchFilters {
  partOfSpeech?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string[];
  hasAudio?: boolean;
  hasExample?: boolean;
}

// Tag types
export interface Tag {
  id: string;
  label: string;
  category: 'trending' | 'personal' | 'popular' | 'recent';
  count?: number;
  description?: string;
  createdAt?: string;
  userId?: string;
}

export interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
  isLoading: boolean;
}

// Component prop types
export interface SearchInputProps {
  initialValue?: string;
  onSearch: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  isLoading?: boolean;
  suggestions?: string[];
  showFilters?: boolean;
  className?: string;
}

export interface TagListProps {
  title: string;
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
  onTagRemove?: (tagId: string) => void;
  isLoading?: boolean;
  showAddButton?: boolean;
  maxVisible?: number;
  className?: string;
}

export interface WordCardProps {
  word: WordDefinition;
  onSave?: (word: WordDefinition) => void;
  onShare?: (word: WordDefinition) => void;
  isSaved?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onModeChange?: (mode: 'login' | 'register' | 'forgot-password') => void;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User activity types
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  userId: string;
}

export interface SavedWord {
  id: string;
  word: string;
  definition: string;
  notes?: string;
  tags: string[];
  savedAt: string;
  userId: string;
}

export interface UserActivity {
  searchHistory: SearchHistory[];
  savedWords: SavedWord[];
  recentTags: Tag[];
  preferences: UserPreferences;
}

// App state types
export interface AppState {
  auth: AuthState;
  search: SearchState;
  tags: {
    trending: Tag[];
    personal: Tag[];
    popular: Tag[];
    recent: Tag[];
  };
  userActivity: UserActivity;
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    notifications: Notification[];
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Route types
export interface RouteParams {
  word?: string;
  category?: string;
  userId?: string;
}

// Form validation schemas
export interface FormErrors {
  [key: string]: string | undefined;
}

// API endpoints configuration
export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    profile: string;
  };
  dictionary: {
    search: string;
    word: string;
    suggestions: string;
    trending: string;
  };
  user: {
    profile: string;
    preferences: string;
    history: string;
    savedWords: string;
    tags: string;
  };
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}
