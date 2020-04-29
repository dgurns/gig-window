export type ChatMessage = Chat | Tip;

export type Chat = {
  userImageUrl: string;
  userUrlSlug: string;
  username: string;
  message: string;
};

export type Tip = {
  userImageUrl: string;
  userUrlSlug: string;
  username: string;
  tipAmount: number;
};
