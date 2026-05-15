import React from 'react';

/**
 * Premium card component for displaying content in a contained area.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {string} [props.title] - Optional title for the card header
 * @param {string} [props.subtitle] - Optional subtitle below the title
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.headerAction] - Optional element (like a button) to show in the header
 * @returns {React.JSX.Element}
 */
export const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  headerAction
}) => {
  return (
    <div className={`card-premium bg-white p-6 ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-6">
          <div>
            {title && <h3 className="text-lg font-semibold text-dark">{title}</h3>}
            {subtitle && <p className="text-sm text-secondary-text">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
