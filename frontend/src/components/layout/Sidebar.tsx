// frontend/src/components/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-700 text-white w-64 p-4">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/chat">Chat</Link></li>
          <li><Link to="/ingest">Ingest</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
