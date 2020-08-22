export interface User {
  id: number;
  email: string;
  username: string;
  urlSlug: string;
  hashedPassword: string;
  isAllowedToStream: boolean;
  isInPublicMode: boolean;
  muxLiveStreamId?: string;
  muxStreamKey?: string;
  muxPlaybackId?: string;
  muxLiveStreamStatus?:
    | 'created'
    | 'connected'
    | 'recording'
    | 'active'
    | 'disconnected'
    | 'idle'
    | 'updated'
    | 'deleted';
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
