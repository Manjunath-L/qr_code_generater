import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };

  const colorMap = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeMap[size]} border-4 border-neutral-200 border-t-${colorMap[color as keyof typeof colorMap]} rounded-full animate-spin`}
      ></div>
      {text && (
        <div className="mt-4 text-neutral-600 dark:text-neutral-300 animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col items-center max-w-md mx-auto">
        <LoadingSpinner size="lg" />
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Loading Flowchart Editor
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}