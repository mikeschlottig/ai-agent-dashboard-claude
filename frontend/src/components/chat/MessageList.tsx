// frontend/src/components/chat/MessageList.tsx
import React from 'react';
import useChatStore from '../../stores/chatStore';

const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-bubble">
              {message.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
