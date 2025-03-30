import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileView from '../src/components/ProfileView';
import { UserContext } from '../src/UserContext';
import { describe, it, expect } from 'vitest';

describe('ProfileView component', () => {
  it('renders the profile view with user information', () => {
    const mockUser = {
      name: 'John Doe',
      bio: 'Just a regular old guy!',
      location: 'Pomona, CA',
      joined: '20XX',
    };

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <ProfileView />
      </UserContext.Provider>
    );

    // Check for the user's name
    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeInTheDocument();

    // Check for the user's bio
    const bioElement = screen.getByText('Just a regular old guy!');
    expect(bioElement).toBeInTheDocument();

    // Check for the user's location
    const locationElement = screen.getByText('Pomona, CA | Joined 20XX');
    expect(locationElement).toBeInTheDocument();

    // Check for the profile picture
    const imageElement = screen.getByAltText('Profile');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe('/src/assets/defaultProfilePicture.png');
  });

  it('renders error message when user context is not provided', () => {
    render(<ProfileView />);

    const errorElement = screen.getByText('Error: UserContext is not provided');
    expect(errorElement).toBeInTheDocument();
  });

  it('renders error message when user is not available', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <ProfileView />
      </UserContext.Provider>
    );

    const errorElement = screen.getByText('Error: User is not available');
    expect(errorElement).toBeInTheDocument();
  });
});