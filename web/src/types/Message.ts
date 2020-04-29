export interface Message {
  type: MessageType;
  userImageUrl: string;
  userUrlSlug: string;
  username: string;
  message?: string;
  tipAmount?: number;
}

export enum MessageType {
  Chat = 'chat',
  Tip = 'tip',
}

export class Chat {
  type: MessageType = MessageType.Chat;

  constructor(
    public userImageUrl: string,
    public userUrlSlug: string,
    public username: string,
    public message: string
  ) {}
}

export class Tip {
  type: MessageType = MessageType.Tip;

  constructor(
    public userImageUrl: string,
    public userUrlSlug: string,
    public username: string,
    public tipAmount: number
  ) {}
}
