export interface User {
  id: number;
  email: string;
  username: string;
  urlSlug: string;
  hashedPassword: string;
  isAllowedToStream: boolean;
  streamKey: string;
  isPublishingStream: boolean;
  isInPublicMode: boolean;
  lastPublishedStreamStartTimestamp: string;
  lastPublishedStreamEndTimestamp: string;
  liveVideoInfrastructureError: string;
  awsMediaLiveInputId: string;
  awsMediaLiveChannelId: string;
  awsMediaLiveChannelEnteredRunningStateTimestamp?: string;
  awsMediaPackageChannelId: string;
  awsMediaPackageChannelIngestUrl: string;
  awsMediaPackageChannelIngestUsername: string;
  awsMediaPackageChannelIngestPasswordParam: string;
  awsMediaPackageOriginEndpointId: string;
  awsMediaPackageOriginEndpointUrl: string;
  profileImageUrl: string;
  stripeCustomerId: string;
  stripeConnectAccountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: number;
  user: User;
  userId: number;
  parentUser: User;
  parentUserId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  amountInCents: number;
  stripePaymentIntentId: string;
  user: User;
  userId: number;
  payeeUser: User;
  payeeUserId: number;
  showId?: number;
  isRefunded?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatEvent {
  chat?: Chat;
  payment?: Payment;
}

export interface Show {
  id: number;
  title: string;
  showtime: string;
  user: User;
}
