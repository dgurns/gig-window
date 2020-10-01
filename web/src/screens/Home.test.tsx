import React from "react";
import { render, screen } from "test-utils";
import Home from "screens/Home";

describe("Home screen", () => {
  it("should show a splash screen and live & upcoming shows for a logged out user", async () => {
    render(<Home />);

    await screen.findByText(/Monetize your live streams/i);
    screen.getByText(/Sign up/i);

    await screen.findByText(/Live now/i);
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 8:00 PM/i);
    screen.getByText(/Dan's show/i);
  });

  it("should display shows but no splash screen for a logged in user", async () => {
    render(<Home />);

    await screen.findByText(/Live now/i);
    screen.getByText(/Upcoming shows/i);
    screen.getByText(/October 2 at 8:00 PM/i);
    screen.getByText(/Dan's show/i);

    expect(screen.queryByText(/Monetize your live streams/)).toBeFalsy();
  });
});
