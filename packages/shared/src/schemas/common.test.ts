import { describe, it, expect } from 'vitest';
import { PaginationSchema, StakeholderRole, Sentiment, HealthStatus } from './common';

describe('PaginationSchema', () => {
  it('parses valid pagination params with defaults', () => {
    const result = PaginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('coerces string numbers', () => {
    const result = PaginationSchema.parse({ page: '3', limit: '50' });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it('rejects invalid page', () => {
    expect(() => PaginationSchema.parse({ page: 0 })).toThrow();
  });

  it('rejects limit over 100', () => {
    expect(() => PaginationSchema.parse({ limit: 101 })).toThrow();
  });
});

describe('Enums', () => {
  it('validates stakeholder roles', () => {
    expect(StakeholderRole.parse('CHAMPION')).toBe('CHAMPION');
    expect(() => StakeholderRole.parse('INVALID')).toThrow();
  });

  it('validates sentiment', () => {
    expect(Sentiment.parse('ADVOCATE')).toBe('ADVOCATE');
    expect(() => Sentiment.parse('INVALID')).toThrow();
  });

  it('validates health status', () => {
    expect(HealthStatus.parse('HEALTHY')).toBe('HEALTHY');
    expect(HealthStatus.parse('MONITOR')).toBe('MONITOR');
    expect(HealthStatus.parse('AT_RISK')).toBe('AT_RISK');
  });
});
