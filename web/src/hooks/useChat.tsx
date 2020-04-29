import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { SocketEvent } from 'types/SocketEvent';
import { ChatMessage } from 'types/ChatMessage';

const { REACT_APP_CHAT_URL } = process.env;

type SendMessageFunction = (message: ChatMessage | undefined) => void;

const useChat = (urlSlug?: string): [ChatMessage[], SendMessageFunction] => {
  // Needed to force the component to rerender
  const [, setMessageCount] = useState(0);

  const defaultMessages: ChatMessage[] = [];
  const messages = useRef(defaultMessages);
  const defaultSendMessage: SendMessageFunction = () => {};
  const sendMessage = useRef(defaultSendMessage);

  useEffect(() => {
    let isMounted = true;

    if (!urlSlug) {
      return;
    }

    const socket = io.connect(REACT_APP_CHAT_URL || '');

    const updateMessages = (updatedMessages: ChatMessage[]) => {
      if (!isMounted) {
        return;
      }
      messages.current = updatedMessages;
      setMessageCount(updatedMessages.length);
    };

    socket.on(SocketEvent.Connect, () => {
      if (isMounted) {
        socket.emit(SocketEvent.JoinRoom, urlSlug);
      }
    });
    socket.on(SocketEvent.NewMessage, (data: ChatMessage) => {
      if (isMounted) {
        updateMessages([...messages.current, data]);
      }
    });

    sendMessage.current = (message: ChatMessage | undefined): void => {
      if (!message || !urlSlug || !isMounted) {
        return;
      }
      socket.emit(SocketEvent.NewMessage, message);
    };

    return () => {
      isMounted = false;
      socket.off(SocketEvent.Connect);
      socket.off(SocketEvent.NewMessage);
      socket.disconnect();
    };
  }, [urlSlug]);

  return [messages.current, sendMessage.current];
};

export default useChat;
