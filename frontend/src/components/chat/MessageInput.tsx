// frontend/src/components/chat/MessageInput.tsx
import React from 'react';
import useChatStore from '../../stores/chatStore';

const MessageInput: React.FC = () => {
  const { inputText, setInputText, sendMessage, isLoading } = useChatStore();

  const handleSendMessage = () => {
    if (inputText.trim() && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded-l"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
