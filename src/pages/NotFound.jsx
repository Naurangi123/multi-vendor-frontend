import React from 'react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <div className="mb-6">
        <svg
          className="w-40 h-40 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21a6 6 0 100-12 6 6 0 000 12zm0 0v2a6 6 0 006 6h2M33 33l9 9"
          />
          <circle cx="21" cy="21" r="18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl mt-2 text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go back home
      </a>
    </div>
  );
}

export default NotFound;
