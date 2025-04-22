import React, { useState } from 'react';

const Topbar = () => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    { id: 'cyrptocurrencies', label: 'Cyrptocurrencies', content: 'Customers Overlay Content' },
    { id: 'dexScan', label: 'DexScan', content: 'Trade Overlay Content' },
    { id: 'exchanges', label: 'Exchanges', content: 'Community Products Overlay Content' },
    { id: 'community', label: 'Community', content: 'Portfolio Overlay Content' },
    { id: 'products', label: 'Products', content: 'Watchlist Overlay Content' },
  ];

  return (
    <div className="bg-gray-800 text-white p-4 relative">
      <div className="flex space-x-8 items-center">
        <div className='text-2xl font-bold flex items-center space-x-2'>
            KoinX</div>
        {sections.map((section) => (
          <div
            key={section.id}
            className="relative"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <button className="hover:text-gray-300">{section.label}</button>
            {hoveredSection === section.id && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-700 p-4 rounded-lg shadow-lg">
                {section.content}
              </div>
            )}
          </div>
        ))}
        <div className='flex items-center ml-auto'>
          <div className='flex items-center gap-x-1'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            <div>Portfolio</div>
          </div>
          <div className='flex items-center gap-x-1 ml-4'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            <div>Watchlist</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;