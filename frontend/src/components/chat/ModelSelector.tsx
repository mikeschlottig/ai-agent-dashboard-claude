// frontend/src/components/chat/ModelSelector.tsx
import React from 'react';
import useChatStore from '../../stores/chatStore';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel } = useChatStore();

  return (
    <div className="p-4">
      <label htmlFor="model-selector" className="block mb-2">Model</label>
      <select
        id="model-selector"
        className="w-full p-2 border rounded"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option>GPT-4</option>
        <option>Claude 3</option>
      </select>
    </div>
  );
};

export default ModelSelector;
