import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteContainer from '../src/components/NoteContainer';


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ noteId: '123' }),
  };
});

describe('NoteContainer', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <NoteContainer />
      </BrowserRouter>
    );
  });

  it('shows save button', () => {
    render(
      <BrowserRouter>
        <NoteContainer />
      </BrowserRouter>
    );
    expect(screen.getByAltText('save icon')).toBeInTheDocument();
  });

  it('shows download button', () => {
    render(
      <BrowserRouter>
        <NoteContainer />
      </BrowserRouter>
    );
    expect(screen.getByAltText('download icon')).toBeInTheDocument();
  });
});