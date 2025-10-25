import React from 'react';

/**
 * PageHero
 * Reusable top hero section with background image and overlay.
 * Props:
 * - title: string (centered title text)
 * - bgImage: import/url for background
 * - overlay: string tailwind color opacity (default 'bg-black/50')
 * - children: optional node rendered under the title
 * - className: extra classes for the wrapper
 */
const PageHero = ({ title, bgImage, overlay = 'bg-black/50', children, className = '' }) => {
  return (
    <div
      className={`bg-gray-900 pb-32 relative min-h-[400px] ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* darker veil to improve title/nav contrast */}
      <div aria-hidden className={`absolute inset-0 ${overlay} pointer-events-none`} />

      <div className="max-w-7xl mx-auto py-20 px-6 flex items-center justify-center relative z-10">
        {title && (
          <h1 className="text-5xl pt-14 font-bold text-white text-center">{title}</h1>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageHero;
