import React from 'react';
import { render, screen } from 'test-utils';
import Home from 'screens/Home';
import {
  getCurrentUser_loggedOut,
  getCurrentUser_loggedIn,
  getUsersStreamingLive_one,
  getShows_two,
} from 'mocks';

describe('Home screen', () => {
  it('should show a splash screen and live & upcoming shows for a logged out user', async () => {
    render(<Home />, {
      mocks: [
        getCurrentUser_loggedOut,
        getCurrentUser_loggedOut,
        getUsersStreamingLive_one,
        getUsersStreamingLive_one,
        getShows_two,
        getShows_two,
      ],
    });

    await screen.findByText(/Monetize your live streams/i);
    screen.getByText(/Sign up/i);

    screen.getByText(/Live now/i);
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 8:00 PM/i);
    screen.getByText(/Dan's show/i);
  });

  it('should display shows but no splash screen for a logged in user', async () => {
    render(<Home />, {
      mocks: [
        getCurrentUser_loggedIn,
        getCurrentUser_loggedIn,
        getUsersStreamingLive_one,
        getUsersStreamingLive_one,
        getShows_two,
        getShows_two,
      ],
    });

    await screen.findByText(/Live now/i);
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 8:00 PM/i);
    screen.getByText(/Dan's show/i);

    expect(screen.queryByText(/Monetize your live streams/)).toBeFalsy();
  });
});
