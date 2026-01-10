// frontend/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Ingest from './pages/Ingest';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/ingest" element={<Ingest />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
