import React from 'react';
import { render, screen, wait, act } from 'test-utils';
import Home from 'screens/Home';
import { server, graphql } from 'mocks/server';

describe('Home screen', () => {
  it('should show a splash screen and live & upcoming shows for a logged out user', async () => {
    server.use(
      graphql.query('GetCurrentUser', (_, res, ctx) => {
        return res(
          ctx.data({
            getCurrentUser: null,
          })
        );
      })
    );
    render(<Home />);

    await screen.findByText(/Play online shows/i);
    screen.getByText(/Sign up/i);

    await screen.findByText(/Live now/i);
    await wait(() => {
      expect(screen.queryAllByText(/dang/i).length).toEqual(3);
    });
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 7:00 PM/i);
    screen.getByText(/Dan's show/i);
  });

  it('should display shows but no splash screen for a logged in user', async () => {
    render(<Home />);

    await screen.findByText(/Live now/i);
    await wait(() => {
      expect(screen.queryAllByText(/dang/i).length).toEqual(3);
    });
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 7:00 PM/i);
    screen.getByText(/Dan's show/i);

    expect(screen.queryByText(/Play online shows/)).toBeFalsy();
  });
});
