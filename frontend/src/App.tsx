import React from 'react';

const App = () => {
  return (
    <div className="max-w-7xl mx-auto p-5">
      <header className="text-center mb-8 bg-gray-800/50 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-gray-700/50">
        <h1 className="text-5xl font-bold text-cyan-400 mb-2" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>
          🤖 AI Agent Integration Dashboard
        </h1>
        <p className="text-lg text-blue-200 max-w-3xl mx-auto">
          Comprehensive API integration scripts for embedding AI models into any application with Chat, MCP, and Knowledge Base capabilities
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card bg-gray-800/50 p-5 rounded-2xl text-center shadow-lg backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/20">
          <div className="text-5xl font-bold text-cyan-400 mb-1">200+</div>
          <div className="text-lg text-blue-200">AI Models</div>
        </div>
        <div className="stat-card bg-gray-800/50 p-5 rounded-2xl text-center shadow-lg backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/20">
          <div className="text-5xl font-bold text-cyan-400 mb-1">15+</div>
          <div className="text-lg text-blue-200">Providers</div>
        </div>
        <div className="stat-card bg-gray-800/50 p-5 rounded-2xl text-center shadow-lg backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/20">
          <div className="text-5xl font-bold text-cyan-400 mb-1">50+</div>
          <div className="text-lg text-blue-200">Integration Examples</div>
        </div>
        <div className="stat-card bg-gray-800/50 p-5 rounded-2xl text-center shadow-lg backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-400/20">
          <div className="text-5xl font-bold text-cyan-400 mb-1">99.9%</div>
          <div className="text-lg text-blue-200">Uptime</div>
        </div>
      </div>
    </div>
  );
};

export default App;
