// components/ui/IASTText.tsx
// Component for displaying IAST transliteration

import { ReactNode } from 'react';

interface IASTTextProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  className?: string;
  as?: 'span' | 'div' | 'p';
  italic?: boolean;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export default function IASTText({
  children,
  size = 'base',
  className = '',
  as: Component = 'span',
  italic = true,
}: IASTTextProps) {
  const baseClasses = 'font-iast text-gray-600';
  const sizeClass = sizeClasses[size];
  const italicClass = italic ? 'italic' : '';
  
  const combinedClasses = `${baseClasses} ${sizeClass} ${italicClass} ${className}`.trim();
  
  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
}
