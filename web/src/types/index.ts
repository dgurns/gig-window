import { User } from '../../../api/src/entities/User';
import { Chat } from '../../../api/src/entities/Chat';
import { Payment } from '../../../api/src/entities/Payment';
import { ChatEvent } from '../../../api/src/entities/ChatEvent';

export { User, Chat, Payment, ChatEvent };

export interface Show {
  id: number;
  title: string;
  showtime: string;
  user: User;
}
