'use client';

export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-white/20 border-t-white h-5 w-5 ${className}`} />
  );
} 