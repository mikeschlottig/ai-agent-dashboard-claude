// frontend/src/components/chat/ChatSettings.tsx
import React from 'react';
import ModelSelector from './ModelSelector';

const ChatSettings: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4">Chat Settings</h2>
      <ModelSelector />
    </div>
  );
};

export default ChatSettings;
