import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { TipMessage } from '../../../chat/src/types/TipMessage';
import { ChatMessage } from '../../../chat/src/types/ChatMessage';

const { REACT_APP_CHAT_URL } = process.env;

type Message = ChatMessage | TipMessage;
type SendMessageFunction = (message: Message | undefined) => void;

const useChat = (urlSlug?: string): [Message[], SendMessageFunction] => {
  // Needed to force the component to rerender
  const [, setMessageCount] = useState(0);

  const defaultMessages: Message[] = [];
  const messages = useRef(defaultMessages);
  const defaultSendMessage: SendMessageFunction = () => {};
  const sendMessage = useRef(defaultSendMessage);

  useEffect(() => {
    let isMounted = true;

    if (!urlSlug) {
      return;
    }

    const socket = io.connect(REACT_APP_CHAT_URL || '');

    const updateMessages = (updatedMessages: Message[]) => {
      if (!isMounted) {
        return;
      }
      messages.current = updatedMessages;
      setMessageCount(updatedMessages.length);
    };

    socket.on('connect', () => {
      if (isMounted) {
        socket.emit('join_room', urlSlug);
      }
    });
    socket.on('new_message', (data: Message) => {
      if (isMounted) {
        updateMessages([...messages.current, data]);
      }
    });

    sendMessage.current = (message: Message | undefined): void => {
      if (!message || !urlSlug || !isMounted) {
        return;
      }
      socket.emit('new_message', message);
    };

    return () => {
      isMounted = false;
      socket.off('connect');
      socket.off('new_message');
      socket.disconnect();
    };
  }, [urlSlug]);

  return [messages.current, sendMessage.current];
};

export default useChat;
