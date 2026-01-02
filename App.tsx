import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StrategicAnalyzer from './components/StrategicAnalyzer';
import ChatBot from './components/ChatBot';
import Tracker from './components/Tracker';
import Settings from './components/Settings';
import { AppView } from './types';
import { BusinessProvider } from './contexts/BusinessContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  return (
    <BusinessProvider>
      <div className="min-h-screen bg-rfx-900 text-slate-200 font-sans selection:bg-blue-500/30">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        
        <main className="ml-64 p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {currentView === AppView.DASHBOARD && <Dashboard />}
            {currentView === AppView.TRACKER && <Tracker />}
            {currentView === AppView.STRATEGY && <StrategicAnalyzer />}
            {currentView === AppView.ASSISTANT && <ChatBot />}
            {currentView === AppView.SETTINGS && <Settings />}
          </div>
        </main>
      </div>
    </BusinessProvider>
  );
};

export default App;