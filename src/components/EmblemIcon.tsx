import React from 'react';

export const AshokaEmblem: React.FC<{ className?: string }> = ({ className = "w-12 h-14" }) => (
  <svg
    viewBox="0 0 100 125"
    fill="currentColor"
    className={className}
    aria-label="National Emblem of India"
    role="img"
  >
    {/* Stylized representation of Ashoka Lion Capital */}
    <g fill="currentColor">
      {/* Central Lion */}
      <path d="M50,15 C44,15 41,20 41,26 C41,31 43,35 46,38 C42,42 41,48 42,55 C44,57 47,59 50,59 C53,59 56,57 58,55 C59,48 58,42 54,38 C57,35 59,31 59,26 C59,20 56,15 50,15 Z" />
      {/* Left Lion Head profile */}
      <path d="M35,22 C30,22 26,27 27,33 C27,38 31,43 35,45 C34,49 35,54 37,58 C40,58 43,56 44,53 C43,47 41,42 39,37 C41,34 41,28 39,24 C38,22 36,22 35,22 Z" />
      {/* Right Lion Head profile */}
      <path d="M65,22 C70,22 74,27 73,33 C73,38 69,43 65,45 C66,49 65,54 63,58 C60,58 57,56 56,53 C57,47 59,42 61,37 C59,34 59,28 61,24 C62,22 64,22 65,22 Z" />
      {/* Abacus platform */}
      <rect x="24" y="60" width="52" height="6" rx="1.5" />
      {/* Central Ashoka Chakra */}
      <circle cx="50" cy="72" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="50" cy="72" r="1.5" />
      {/* Chakra spokes */}
      <line x1="50" y1="65" x2="50" y2="79" stroke="currentColor" strokeWidth="0.8" />
      <line x1="43" y1="72" x2="57" y2="72" stroke="currentColor" strokeWidth="0.8" />
      <line x1="45" y1="67" x2="55" y2="77" stroke="currentColor" strokeWidth="0.8" />
      <line x1="45" y1="77" x2="55" y2="67" stroke="currentColor" strokeWidth="0.8" />
      {/* Bull and Horse decorative base */}
      <path d="M30,68 C27,69 25,72 26,75 C27,77 31,77 34,75 C35,73 34,69 30,68 Z" />
      <path d="M70,68 C73,69 75,72 74,75 C73,77 69,77 66,75 C65,73 66,69 70,68 Z" />
      {/* Base Pedestal */}
      <rect x="20" y="80" width="60" height="5" rx="1" />
      {/* Inscription line representing "सत्यमेव जयते" */}
      <text x="50" y="93" fontSize="6.5" textAnchor="middle" fontWeight="bold" fontFamily="serif" fill="currentColor">
        सत्यमेव जयते
      </text>
    </g>
  </svg>
);

export const AshokaChakraIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-blue-900" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-label="Ashoka Chakra"
    role="img"
  >
    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    {/* 24 spokes */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="8"
          stroke="currentColor"
          strokeWidth="2.5"
          transform={`rotate(${angle} 50 50)`}
        />
      );
    })}
  </svg>
);
