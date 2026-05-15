import React from 'react';

/**
 * Reusable button component with multiple variants and sizes.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or icon
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant] - Visual style of the button
 * @param {'sm' | 'md' | 'lg'} [props.size] - Physical size of the button
 * @param {boolean} [props.isLoading] - Shows a loading spinner if true
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  const variants = {

    primary: "bg-primary text-white hover:bg-opacity-90",
    secondary: "bg-primary-light text-primary hover:bg-opacity-80",
    danger: "bg-danger text-white hover:bg-opacity-90",
    ghost: "bg-transparent text-primary hover:bg-primary-light"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}

      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};
