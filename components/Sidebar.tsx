import React from 'react';
import { LayoutDashboard, MessageSquare, BrainCircuit, Settings, LogOut, Building2, Target } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.TRACKER, label: 'Business Tracker', icon: Target },
    { id: AppView.STRATEGY, label: 'Intelligence', icon: BrainCircuit },
    { id: AppView.ASSISTANT, label: 'Advisor AI', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-rfx-900 border-r border-rfx-800 flex flex-col h-screen fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-rfx-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Building2 className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">RFX CORP</h1>
          <p className="text-xs text-slate-400">Enterprise Suite</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-rfx-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-rfx-800 space-y-2">
        <button 
          onClick={() => onChangeView(AppView.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
            currentView === AppView.SETTINGS 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-rfx-800'
          }`}
        >
          <Settings size={18} />
          <span>Impostazioni</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-rfx-800 rounded-lg transition-colors text-sm">
          <LogOut size={18} />
          <span>Disconnetti</span>
        </button>
      </div>
      
      <div className="p-4 text-center">
        <p className="text-[10px] text-slate-600">RFX Corp v2.5.0</p>
      </div>
    </div>
  );
};

export default Sidebar;