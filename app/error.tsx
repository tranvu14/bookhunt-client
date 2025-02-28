'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-700 rounded-lg hover:bg-red-800 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
} 