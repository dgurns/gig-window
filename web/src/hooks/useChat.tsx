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

  const defaultMessagesValue: Message[] = [];
  const messages = useRef(defaultMessagesValue);

  const socket = useMemo(() => io.connect(REACT_APP_CHAT_URL || ''), []);

  const updateMessages = (updatedMessages: Message[]) => {
    messages.current = updatedMessages;
    setMessageCount(updatedMessages.length);
  };

  useEffect(() => {
    if (!urlSlug) {
      return;
    }
    socket.on('connect', () => socket.emit('join_room', urlSlug));
    socket.on('new_message', (data: Message) => {
      console.log('new message for', urlSlug);
      updateMessages([...messages.current, data]);
    });

    // Need to clean up?
  }, [urlSlug, socket]);

  const sendMessage = useCallback(
    (message: Message | undefined): void => {
      if (!message) {
        return;
      }
      socket.emit('new_message', message);
    },
    [socket]
  );

  return [messages.current, sendMessage];
};

export default useChat;
