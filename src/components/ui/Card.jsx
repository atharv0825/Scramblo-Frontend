import React from 'react';

// Utility to combine Tailwind classes cleanly
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Reusable Card Component
 * @param {string} size - Overall padding size ('sm', 'md', 'lg', 'none')
 * @param {string} radius - Border radius ('sm', 'md', 'lg', 'xl', '2xl', '3xl', 'none')
 * @param {string} color - Background/Border theme ('default', 'glass', 'dark', 'light', 'transparent')
 */
const Card = React.forwardRef(({
  children,
  size = 'md',
  radius = '2xl',
  color = 'default',
  className,
  ...props
}, ref) => {

  // Structural base
  const baseStyles = 'overflow-hidden border transition-colors duration-200 relative';

  // Padding sizes
  const sizeStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 xl:p-10',
    none: 'p-0',
  };

  // Corner radiuses
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  // Thematic colors integrating natively into Tailwind dark mode
  const colorStyles = {
    default: 'bg-white border-gray-200 dark:bg-[#111111] dark:border-gray-800 shadow-sm text-gray-900 dark:text-white',
    // Premium glassmorphism useful for Auth / Overlays
    glass: 'bg-white/70 dark:bg-black/60 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-2xl text-gray-900 dark:text-white',
    dark: 'bg-gray-900 border-gray-800 shadow-md text-white',
    light: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-100',
    transparent: 'bg-transparent border-transparent shadow-none',
  };

  // Fallbacks
  const computedSize = sizeStyles[size] || sizeStyles.md;
  const computedRadius = radiusStyles[radius] || radiusStyles['2xl'];
  const computedColor = colorStyles[color] || colorStyles.default;

  return (
    <div 
      ref={ref}
      className={cn(baseStyles, computedSize, computedRadius, computedColor, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
