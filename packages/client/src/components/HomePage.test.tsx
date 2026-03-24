import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the AccountOS heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    expect(screen.getByText('AccountOS')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );
    expect(
      screen.getByText('Account Intelligence & Relationship Management'),
    ).toBeInTheDocument();
  });
});
