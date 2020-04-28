import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
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

  const socket = useMemo(() => {
    console.log('connecting socket for ', urlSlug);
    return io.connect(REACT_APP_CHAT_URL || '');
  }, []);

  useEffect(() => {
    if (!urlSlug) {
      return;
    }

    console.log('socket is connected', socket.connected);

    const updateMessages = (updatedMessages: Message[]) => {
      messages.current = updatedMessages;
      console.log('updating messages');
      setMessageCount(updatedMessages.length);
    };

    socket.on('connect', () => {
      console.log('connect event for ', urlSlug);
      socket.emit('join_room', urlSlug);
    });
    socket.on('new_message', (data: Message) => {
      console.log('new message event for ', urlSlug);
      updateMessages([...messages.current, data]);
    });

    sendMessage.current = (message: Message | undefined): void => {
      if (!message || !urlSlug) {
        return;
      }
      socket.emit('new_message', message);
    };

    return () => {
      socket.off('connect');
      socket.off('new_message');
    };
  }, [socket, urlSlug]);

  return [messages.current, sendMessage.current];
};

export default useChat;
