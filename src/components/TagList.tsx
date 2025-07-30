import React, { memo, useId } from 'react';
import { Badge } from '@/components/ui/badge';
import { TagListProps } from '@/types';
import { cn, getAriaLabel } from '@/lib/utils';

const TagList = memo<TagListProps>(({ 
  title, 
  tags, 
  onTagClick, 
  className 
}) => {
  const sectionId = useId();
  const listId = useId();

  if (!tags.length) {
    return null;
  }

  const handleTagClick = (tag: typeof tags[0]) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, tag: typeof tags[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTagClick(tag);
    }
  };

  return (
    <section 
      className={cn("mt-8 px-4 sm:px-6 max-w-6xl mx-auto", className)}
      aria-labelledby={sectionId}
    >
      {/* Section Title */}
      <h2 
        id={sectionId}
        className="text-white text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
      >
        {title}
      </h2>

      {/* Tags Container */}
      <div 
        id={listId}
        className="flex flex-wrap gap-2 sm:gap-3"
        role="list"
        aria-labelledby={sectionId}
      >
        {tags.map((tag, index) => (
          <div key={tag.id} role="listitem">
            <Badge
              onClick={() => handleTagClick(tag)}
              onKeyDown={(e) => handleKeyDown(e, tag)}
              tabIndex={0}
              className={cn(
                "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer",
                "transition-all duration-200 text-sm sm:text-base",
                "px-3 py-1 sm:px-4 sm:py-2",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black",
                "hover:scale-105 active:scale-95",
                "border border-gray-700 hover:border-gray-600"
              )}
              aria-label={getAriaLabel(`${tag.label} tag`, `in ${title} section`)}
              role="button"
              aria-describedby={`${tag.id}-description`}
            >
              {tag.label}
            </Badge>
            
            {/* Screen reader description */}
            <span 
              id={`${tag.id}-description`}
              className="sr-only"
            >
              Click to search for {tag.label}
            </span>
          </div>
        ))}
      </div>

      {/* Show More Button for large lists */}
      {tags.length > 12 && (
        <div className="mt-4 text-center">
          <button
            className={cn(
              "text-blue-400 hover:text-blue-300 text-sm font-medium",
              "transition-colors duration-200",
              "focus:outline-none focus:underline"
            )}
            aria-label={`Show more ${title.toLowerCase()} tags`}
          >
            Show more ({tags.length - 6} more)
          </button>
        </div>
      )}

      {/* Loading State */}
      {tags.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-center">
            <div className="animate-pulse flex space-x-2">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gray-800 rounded-full w-16"
                />
              ))}
            </div>
            <p className="mt-4 text-sm">Loading {title.toLowerCase()}...</p>
          </div>
        </div>
      )}
    </section>
  );
});

TagList.displayName = 'TagList';

export { TagList };
