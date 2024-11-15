import React, { useState } from 'react';
import { Play, Pause, Settings, AlertTriangle, Brain, Power, Sliders } from 'lucide-react';
import type { Agent } from '../../types/trading';

interface AgentControlPanelProps {
  agents: Agent[];
  onToggleAgent: (agentId: string) => void;
  onUpdateSettings: (agentId: string, settings: any) => void;
}

export default function AgentControlPanel({ agents, onToggleAgent, onUpdateSettings }: AgentControlPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsUpdate = (settings: any) => {
    if (selectedAgent) {
      onUpdateSettings(selectedAgent, settings);
      setShowSettings(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Agent Controls
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Power className="w-5 h-5" />
          </button>
          <button className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleAgent(agent.id)}
                className={`p-2 rounded-lg transition-colors ${
                  agent.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                {agent.status === 'active' ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedAgent(agent.id);
                  setShowSettings(true);
                }}
                className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
              >
                <Settings className="w-5 h-5" />
              </button>
              {agent.status === 'error' && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {showSettings && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Agent Settings
            </h3>
            {/* Add settings form here */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSettingsUpdate({})}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}