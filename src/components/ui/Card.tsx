import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
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
