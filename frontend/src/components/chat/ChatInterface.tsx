// frontend/src/components/chat/ChatInterface.tsx
import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatInterface;
