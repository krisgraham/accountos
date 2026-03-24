import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          AccountOS
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-4">
          Account Intelligence & Relationship Management
        </p>
        {health ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-rag-healthy)]" />
            <span className="text-[var(--color-text-muted)]">
              API: {health.status}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-rag-at-risk)]" />
            <span className="text-[var(--color-text-muted)]">
              API: connecting...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
