import React from 'react';

interface UdyamSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const UdyamSetuLogo: React.FC<UdyamSetuLogoProps> = ({
  className = '',
  size = 'lg',
  showText = true,
  textColor = 'text-slate-900'
}) => {
  // Dimensions for the icon depending on size
  const iconDimensions = {
    sm: { width: 38, height: 38 },
    md: { width: 48, height: 48 },
    lg: { width: 62, height: 62 },
    xl: { width: 76, height: 76 }
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="udyam-setu-logo-container">
      {/* Big Custom Vector Emblem of Udyam Setu */}
      <div
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-xs"
        style={{ width: iconDimensions.width, height: iconDimensions.height }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Udyam Setu Official Emblem"
        >
          <defs>
            {/* Saffron to Gold Radiant Gradient */}
            <linearGradient id="setuSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Bridge Arch Gradient (Soft slate to deep navy) */}
            <linearGradient id="setuBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Emerald Green Growth Gradient */}
            <linearGradient id="setuGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>

            {/* Sun Glow */}
            <radialGradient id="setuSunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Protective Hexagonal / Circular Halo */}
          <circle cx="50" cy="50" r="47" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="44" fill="#F8FAFC" />

          {/* Golden Dawn Glow (Rising Enterprise Opportunity) */}
          <circle cx="50" cy="38" r="22" fill="url(#setuSunGlow)" />

          {/* Sunburst Rays of Growth & Industry */}
          <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <line x1="50" y1="14" x2="50" y2="20" />
            <line x1="33" y1="21" x2="37" y2="25" />
            <line x1="67" y1="21" x2="63" y2="25" />
            <line x1="24" y1="36" x2="29" y2="38" />
            <line x1="76" y1="36" x2="71" y2="38" />
          </g>

          {/* Central Rising Sun / Ashoka Core */}
          <circle cx="50" cy="38" r="11" fill="url(#setuSaffronGrad)" />
          {/* Inner Chakra Hub */}
          <circle cx="50" cy="38" r="4.5" fill="#FFFFFF" />
          <circle cx="50" cy="38" r="2.2" fill="#1E293B" />

          {/* The SETU (Grand Arching Bridge) - Symbol of empowerment & financial transit */}
          {/* Bridge Cables / Vertical Suspension Struts */}
          <g stroke="#94A3B8" strokeWidth="1" opacity="0.7">
            <line x1="34" y1="46" x2="34" y2="58" />
            <line x1="42" y1="42" x2="42" y2="58" />
            <line x1="50" y1="40" x2="50" y2="58" />
            <line x1="58" y1="42" x2="58" y2="58" />
            <line x1="66" y1="46" x2="66" y2="58" />
          </g>

          {/* Upper Parabolic Suspension Cable */}
          <path
            d="M 24 50 Q 50 36 76 50"
            stroke="url(#setuSaffronGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bridge Deck Roadway (Clean Slate Tone) */}
          <path
            d="M 16 60 C 26 59 74 59 84 60"
            stroke="url(#setuBridgeGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* White Center Line on Bridge Deck */}
          <path
            d="M 22 60 L 78 60"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />

          {/* Bridge Foundation Pylons & Pier Columns */}
          <path
            d="M 26 62 L 28 80 L 34 80 L 32 62 Z"
            fill="#334155"
          />
          <path
            d="M 68 62 L 66 80 L 72 80 L 74 62 Z"
            fill="#334155"
          />

          {/* Lower Foundation Ground / Green Agriculture & Enterprise Base */}
          <path
            d="M 12 76 Q 50 72 88 76 L 85 86 Q 50 89 15 86 Z"
            fill="url(#setuGreenGrad)"
          />

          {/* Center Sprout / Micro-Enterprise Ascent Motif */}
          <path
            d="M 50 74 C 48 68 44 65 40 66 C 40 71 45 74 50 74 Z"
            fill="#86EFAC"
          />
          <path
            d="M 50 74 C 52 68 56 65 60 66 C 60 71 55 74 50 74 Z"
            fill="#4ADE80"
          />
          <circle cx="50" cy="74" r="2" fill="#FFFFFF" />
        </svg>

        {/* Small Official Tri-color Indicator Dot */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-white flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Brand Text Lockup */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none">
              उद्यम सेतु
            </span>
            <span className="text-xs text-slate-300 font-light">|</span>
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-800 leading-none">
              UDYAM SETU
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 tracking-tight leading-snug">
            National Micro-Enterprise Concessional Credit & Advisory Bridge
          </span>
          <span className="text-[9px] font-semibold text-amber-700 tracking-wide">
            MoSJE • NBCFDC • NSFDC • NSKFDC
          </span>
        </div>
      )}
    </div>
  );
};
