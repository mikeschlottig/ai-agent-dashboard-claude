// frontend/src/stores/chatStore.ts
import {create} from 'zustand';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  selectedModel: string;
  inputText: string;
  isLoading: boolean;
  setInputText: (text: string) => void;
  sendMessage: () => Promise<void>;
  setSelectedModel: (model: string) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  selectedModel: 'GPT-4',
  inputText: '',
  isLoading: false,
  setInputText: (text) => set({ inputText: text }),
  sendMessage: async () => {
    const { inputText, selectedModel, messages } = get();
    if (!inputText.trim()) return;

    const newUserMessage: Message = { role: 'user', content: inputText };
    set({ messages: [...messages, newUserMessage], inputText: '', isLoading: true });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/models/chat`, {
        message: inputText,
        model: selectedModel,
      });

      const assistantResponse: Message = {
        role: 'assistant',
        content: response.data.response,
      };
      set((state) => ({
        messages: [...state.messages, assistantResponse],
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally, add an error message to the chat
    } finally {
      set({ isLoading: false });
    }
  },
  setSelectedModel: (model) => set({ selectedModel: model }),
}));

export default useChatStore;
