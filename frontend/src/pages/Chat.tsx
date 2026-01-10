// frontend/src/pages/Chat.tsx
import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import ChatSettings from '../components/chat/ChatSettings';

const Chat: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ChatInterface />
      </div>
      <div className="w-80">
        <ChatSettings />
      </div>
    </div>
  );
};

export default Chat;
