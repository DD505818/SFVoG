import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AgentList from './components/AgentList';
import WalletOverview from './components/portfolio/WalletOverview';
import AssetList from './components/portfolio/AssetList';
import AIAgentList from './components/ai/AIAgentList';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full py-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-white/10">
        <h1 className="text-6xl md:text-8xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          DD
        </h1>
        <p className="text-center text-gray-400 mt-2">Decentralized Decisions</p>
      </div>
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Dashboard />
        <div className="mt-6">
          <AIAgentList />
        </div>
        <div className="mt-6">
          <WalletOverview />
          <AssetList />
        </div>
        <div className="mt-6">
          <AgentList />
        </div>
      </main>
    </div>
  );
}

export default App;