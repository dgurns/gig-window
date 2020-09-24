import React from 'react';
import { render, screen, wait } from 'test-utils';
import App from 'App';
import {
  getCurrentUser_loggedOut,
  getUsersStreamingLive_one,
  getShows_two,
} from 'mocks';

const mocks = [
  getCurrentUser_loggedOut,
  getUsersStreamingLive_one,
  getShows_two,
];

describe('App component', () => {
  it('should not display UI while fetching current user status', async () => {
    const { container } = render(<App />, { mocks });
    expect(container.firstChild).toBe(null);
    await Promise.resolve();
  });

  it('should show app content after checking for current user', async () => {
    render(<App />, { mocks });

    await screen.findByText(/Monetize your live streams/i);
    screen.getByText(/Log in/i);
    expect(screen.getAllByText(/Sign up/i).length).toEqual(2);

    screen.getByText(/Live now/i);
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 8:00 PM/i);
    screen.getByText(/Dan's show/i);
    screen.getAllByText(/Github/i, { exact: false });
  });
});
