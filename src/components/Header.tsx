import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeaderProps } from '@/types';
import { cn, getAriaLabel, getImageProps } from '@/lib/utils';

const Header = memo<HeaderProps>(({ 
  onSearch, 
  user = { name: 'User', initials: 'U' } 
}) => {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('header-search') as string;
    if (query?.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <header 
      className="flex items-center justify-between px-4 sm:px-6 py-4 bg-black border-b border-gray-800"
      role="banner"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img 
          {...getImageProps('/task1/logo.png', 'Wortionary logo')}
          className="w-8 h-8 sm:w-10 sm:h-10"
          width={40}
          height={40}
        />
        <h1 className="text-white font-semibold text-base sm:text-lg">
          Wortionary
        </h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex items-center gap-2 sm:gap-4" role="navigation">
        {/* Header Search */}
        <form 
          onSubmit={handleSearchSubmit}
          className="relative hidden sm:block"
          role="search"
          aria-label="Header search"
        >
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
              aria-hidden="true"
            />
            <Input
              name="header-search"
              type="search"
              placeholder="Quick search..."
              className={cn(
                "pl-10 pr-4 py-2 w-48 lg:w-64",
                "bg-gray-800 text-white border-gray-700",
                "placeholder:text-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "rounded-full transition-all duration-200",
                "hover:bg-gray-700"
              )}
              aria-label={getAriaLabel("Search", "in header")}
            />
          </div>
        </form>

        {/* User Avatar */}
        <div className="flex items-center">
          <Avatar 
            className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-transparent hover:ring-gray-600 transition-all duration-200"
          >
            <AvatarImage 
              src={user.avatar} 
              alt={`${user.name}'s profile picture`}
            />
            <AvatarFallback 
              className="bg-gray-700 text-white text-sm font-medium"
              aria-label={`${user.name}'s profile`}
            >
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
});

Header.displayName = 'Header';

export { Header };
