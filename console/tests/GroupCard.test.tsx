import React from 'react';
import { render, screen } from '@testing-library/react';
import GroupCard from '../src/components/Cards/GroupCard';
import { describe, it, expect } from 'vitest';

describe('GroupCard component', () => {
  it('renders the group card with a name, description, and profile picture', () => {
    render(<GroupCard name="Group A" description="This is Group A." profilePicture="/GroupA.png" />);
    
    // Check for the group's name
    const nameElement = screen.getByText('Group A');
    expect(nameElement).toBeInTheDocument();
    
    // Check for the group's description
    const descriptionElement = screen.getByText('This is Group A.');
    expect(descriptionElement).toBeInTheDocument();
    
    // Check that the image is rendered with the correct alt text and src
    const imageElement = screen.getByAltText('ProfilePicture');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe('/GroupA.png');
  });
});