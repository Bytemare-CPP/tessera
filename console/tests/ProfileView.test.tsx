import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserContext } from '../src/UserContext';
import ProfileView from '../src/components/ProfileView';
import { MemoryRouter } from 'react-router-dom';

describe('ProfileView component', () => {
  it('renders the profile view with user information', () => {
    const mockUser = {
      user_id: '123',
      full_name: 'John Doe',
      avatar_url: '/src/assets/defaultProfilePicture.png',
      is_active: true
    };

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: mockUser }}>
          <ProfileView />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeTruthy();

    const bioElement = screen.getByText('Just a regular old guy!');
    expect(bioElement).toBeInTheDocument();

    const locationElement = screen.getByText('Pomona, CA | Joined 20XX');
    expect(locationElement).toBeInTheDocument();

    const imageElement = screen.getByAltText('Profile');
    expect(imageElement).toBeTruthy();
  });

  it('renders error message when user context is not provided', () => {
    render(
      <MemoryRouter>
        <ProfileView />
      </MemoryRouter>
    );

    const errorElement = screen.getByText('Error: UserContext is not provided');
    expect(errorElement).toBeInTheDocument();
  });

  it('renders error message when user is not available', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: null }}>
          <ProfileView />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const errorElement = screen.getByText('Error: User is not available');
    expect(errorElement).toBeInTheDocument();
  });
});
