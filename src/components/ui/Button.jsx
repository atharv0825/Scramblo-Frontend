import React from 'react';

// Simple utility to concatenate classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Button component
 * @param {string} color - e.g., 'primary', 'secondary', 'black', 'transparent'
 * @param {string} variant - e.g., 'solid', 'outline', 'ghost'
 * @param {string} size - e.g., 'sm', 'md', 'lg'
 */
const Button = React.forwardRef(({ 
  children, 
  color = 'primary', 
  variant = 'solid', 
  size = 'md', 
  className, 
  ...props 
}, ref) => {
  
  // Base reusable styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Sizing mappings
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  // Pre-configured color logic scaling seamlessly with Dark Mode variants
  const colorStyles = {
    primary: {
      solid: 'bg-gray-900 border border-transparent shadow-sm text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:ring-gray-400',
      outline: 'bg-transparent border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-400',
    },
    secondary: {
      solid: 'bg-gray-100 border border-transparent shadow-sm text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300',
      // Secondary outline specifically matches the "Explore Articles" / "Create Post" look
      outline: 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 backdrop-blur-sm focus:ring-gray-200',
    },
    black: {
      solid: 'bg-black text-white border border-transparent shadow-sm hover:bg-gray-900 focus:ring-gray-400',
      outline: 'bg-transparent text-black border border-black hover:bg-gray-100 focus:ring-gray-300',
    },
    white: {
      solid: 'bg-white text-black border border-transparent shadow-sm hover:bg-gray-100 focus:ring-gray-300',
      outline: 'bg-transparent text-white border border-white hover:bg-white/10 focus:ring-white',
    }
  };

  // Safe fallback to 'primary' & 'solid'
  const styleMatch = colorStyles[color]?.[variant] || colorStyles.primary.solid;
  const selectedSize = sizeStyles[size] || sizeStyles.md;
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, selectedSize, styleMatch, className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
