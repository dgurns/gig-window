export const seedShows = {
  '1': {
    id: 1,
    title: "Dan's show",
    showtime: '2021-10-02T19:00:00.000Z',
    minPriceInCents: 100,
    user: {
      id: 1,
      username: 'dang',
      urlSlug: 'dang',
      aboutMarkdown: 'Dang is a user',
      profileImageUrl:
        'https://gig-window-dev.s3.amazonaws.com/users/1/profileImage.jpeg?updated=1600184388177',
      __typename: 'User',
    },
    __typename: 'Show',
  },
  '2': {
    id: 34,
    title: 'Fall show',
    showtime: '2021-11-26T14:00:00.000Z',
    minPriceInCents: 100,
    user: {
      id: 1,
      username: 'dang',
      urlSlug: 'dang',
      aboutMarkdown: 'Dang is a user',
      profileImageUrl:
        'https://gig-window-dev.s3.amazonaws.com/users/1/profileImage.jpeg?updated=1600184388177',
      __typename: 'User',
    },
    __typename: 'Show',
  },
};
