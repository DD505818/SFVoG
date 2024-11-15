import React, { useState } from 'react';
import { Menu, Bell, Settings, User, X, Brain, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header className="tech-panel bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="p-1 hover:bg-gray-800/50 rounded-lg md:hidden transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600/10 rounded-lg">
                <Brain className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold tech-text">
                DDGPT Trading
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="tech-button p-2 !px-2">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              className="tech-button p-2 !px-2"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button className="tech-button p-2 !px-2">
              <Settings className="w-5 h-5" />
            </button>
            <button className="tech-button flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800/50">
            <div className="flex flex-col space-y-2">
              <button className="tech-button flex items-center space-x-2 justify-center">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button className="tech-button flex items-center space-x-2 justify-center">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="tech-button flex items-center space-x-2 justify-center">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                className="tech-button flex items-center space-x-2 justify-center"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}