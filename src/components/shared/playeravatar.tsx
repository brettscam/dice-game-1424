import React from 'react';

interface PlayerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlayerAvatar({ name, size = 'md', className = '' }: PlayerAvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-blue-500 text-white
        flex items-center justify-center font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
