import { memo } from 'react';
import { SearchInput } from './SearchInput';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

const HeroSection = memo<HeroSectionProps>(({ 
  onSearch,
  backgroundImage = '/task1/hero-bg.png',
  title = 'Search for words, phrases and meanings',
  subtitle
}) => {
  return (
    <section 
      className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden mt-6 sm:mt-8"
      aria-labelledby="hero-title"
    >
      {/* Background Image */}
      <div className="relative h-64 sm:h-80 md:h-96">
        <img 
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)';
          }}
        />
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <h1 
          id="hero-title"
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6",
            "max-w-4xl leading-tight",
            "drop-shadow-lg"
          )}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Search Input */}
        <div className="w-full max-w-2xl">
          <SearchInput
            onSearch={onSearch}
            placeholder="Search for words, phrases, meanings..."
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {['Popular', 'Recent', 'Trending'].map((action) => (
            <button
              key={action}
              onClick={() => onSearch(action.toLowerCase())}
              className={cn(
                "px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium",
                "bg-white/10 text-white rounded-full",
                "hover:bg-white/20 transition-all duration-200",
                "backdrop-blur-sm border border-white/20",
                "focus:outline-none focus:ring-2 focus:ring-white/50"
              )}
              aria-label={`Search for ${action.toLowerCase()} terms`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-4 left-4 w-12 h-12 bg-blue-500/10 rounded-full blur-lg"
        aria-hidden="true"
      />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection };
