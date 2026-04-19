'use client';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* 金字塔图标 */}
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          <polygon points="16,4 28,28 4,28" fill="url(#goldGradient)" />
        </svg>
      </div>
      {/* 文字 */}
      <span className="text-xl font-semibold text-warm-900 tracking-wide">FundOS</span>
    </div>
  );
}
