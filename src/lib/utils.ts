import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Accessibility utilities
export const getAriaLabel = (text: string, context?: string): string => {
  return context ? `${text} ${context}` : text;
};

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Validation utilities
export const isValidSearchQuery = (query: string): boolean => {
  return query.trim().length >= 2 && query.trim().length <= 100;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Image utilities
export const getImageProps = (src: string, alt: string) => ({
  src,
  alt,
  loading: 'lazy' as const,
  decoding: 'async' as const,
});

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};
