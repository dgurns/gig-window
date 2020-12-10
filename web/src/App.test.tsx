import React from 'react';
import { render, screen, wait } from 'test-utils';
import App from 'App';

describe('App component', () => {
  it('should not display UI while fetching current user status', async () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBe(null);
    await screen.findByText(/Live now/i);
  });

  it('should display UI after the current user has been fetched', async () => {
    render(<App />);

    await screen.findByText(/Live now/i);
    await wait(() => {
      expect(screen.queryAllByText(/dang/i).length).toEqual(4);
    });
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 7:00 PM/i);
    screen.getByText(/Dan's show/i);
    screen.getAllByText(/Github/i, { exact: false });

    expect(screen.queryByText(/Play online shows/i)).toBe(null);
    expect(screen.queryByText(/Log in/i)).toBe(null);
    expect(screen.queryByText(/Sign up/i)).toBe(null);
  });
});
