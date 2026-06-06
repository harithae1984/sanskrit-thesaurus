// components/ui/DevanagariText.tsx
// Wrapper component for proper Devanagari text rendering

import { ReactNode } from 'react';

interface DevanagariTextProps {
  children: ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  showIAST?: boolean;
  iastText?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
}

const sizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export default function DevanagariText({
  children,
  size = 'base',
  weight = 'normal',
  className = '',
  showIAST = false,
  iastText,
  as: Component = 'span',
}: DevanagariTextProps) {
  const baseClasses = 'font-devanagari devanagari-text';
  const sizeClass = sizeClasses[size];
  const weightClass = weightClasses[weight];
  
  const combinedClasses = `${baseClasses} ${sizeClass} ${weightClass} ${className}`.trim();
  
  return (
    <Component className={combinedClasses}>
      {children}
      {showIAST && iastText && (
        <span className="block text-sm text-gray-600 italic mt-1 font-iast">
          {iastText}
        </span>
      )}
    </Component>
  );
}
