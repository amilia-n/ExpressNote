import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextEditor from '../src/components/TextEditor'; 

describe('TextEditor', () => {
  it('renders without crashing', () => {
    render(<TextEditor content={[]} onChange={() => {}} />);
  });

  it('renders with initial content', () => {
    const content = [
      {
        type: 'paragraph',
        children: [{ text: 'Hello World' }],
      },
    ];
    render(<TextEditor content={content} onChange={() => {}} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});