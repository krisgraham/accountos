import { useState } from 'react';

type Sentiment = 'ADVOCATE' | 'SUPPORTIVE' | 'NEUTRAL' | 'RESISTANT' | 'BLOCKER';

interface SentimentDotProps {
  sentiment: Sentiment;
  className?: string;
}

const SENTIMENT_CONFIG: Record<Sentiment, { color: string; label: string }> = {
  ADVOCATE: { color: '#22c55e', label: 'Advocate' },
  SUPPORTIVE: { color: '#86efac', label: 'Supportive' },
  NEUTRAL: { color: '#94a3b8', label: 'Neutral' },
  RESISTANT: { color: '#fb923c', label: 'Resistant' },
  BLOCKER: { color: '#ef4444', label: 'Blocker' },
};

export function SentimentDot({ sentiment, className = '' }: SentimentDotProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = SENTIMENT_CONFIG[sentiment];
  if (!config) return null;

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={8}
        height={8}
        viewBox="0 0 8 8"
        fill={config.color}
        stroke="none"
        aria-label={config.label}
      >
        <circle cx="4" cy="4" r="4" />
      </svg>
      {showTooltip && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-slate-200 shadow-lg"
          role="tooltip"
        >
          {config.label}
        </span>
      )}
    </span>
  );
}
