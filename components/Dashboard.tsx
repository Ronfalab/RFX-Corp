import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from 'lucide-react';
import { BusinessMetric, Project } from '../types';

const data = [
  { name: 'Gen', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'Mag', revenue: 1890, profit: 4800 },
  { name: 'Giu', revenue: 2390, profit: 3800 },
  { name: 'Lug', revenue: 3490, profit: 4300 },
];

const metrics: BusinessMetric[] = [
  { name: 'Fatturato Totale', value: '€2.4M', change: 12.5, trend: 'up' },
  { name: 'Utile Netto', value: '€850k', change: 8.2, trend: 'up' },
  { name: 'Spese Operative', value: '€1.2M', change: -2.4, trend: 'down' }, // down is good for expenses usually, but let's stick to visual logic
  { name: 'Nuovi Clienti', value: '145', change: 24.0, trend: 'up' },
];

const projects: Project[] = [
  { id: 1, name: 'Acquisizione TechAlpha', status: 'In Corso', budget: 500000, progress: 65 },
  { id: 2, name: 'Espansione Mercato Asiatico', status: 'Pianificato', budget: 1200000, progress: 0 },
  { id: 3, name: 'Rebranding RFX', status: 'Completato', budget: 150000, progress: 100 },
  { id: 4, name: 'Automazione Logistica', status: 'In Revisione', budget: 300000, progress: 40 },
];

const MetricCard: React.FC<{ metric: BusinessMetric }> = ({ metric }) => {
  const isPositive = metric.change > 0;
  const isExpense = metric.name === 'Spese Operative';
  
  // Logic: if it's expense, down is green. If it's revenue, up is green.
  let colorClass = 'text-green-500';
  let Icon = TrendingUp;

  if (isExpense) {
     if (metric.change > 0) { colorClass = 'text-red-500'; Icon = TrendingUp; } // Bad
     else { colorClass = 'text-green-500'; Icon = TrendingDown; } // Good
  } else {
     if (metric.change > 0) { colorClass = 'text-green-500'; Icon = TrendingUp; }
     else { colorClass = 'text-red-500'; Icon = TrendingDown; }
  }

  return (
    <div className="bg-rfx-800 p-6 rounded-xl border border-rfx-700 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{metric.name}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{metric.value}</h3>
        </div>
        <div className={`p-2 rounded-full bg-slate-700/50 ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className={`font-bold mr-2 ${colorClass}`}>
          {metric.change > 0 ? '+' : ''}{metric.change}%
        </span>
        <span className="text-slate-500">rispetto al mese scorso</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Panoramica Holding</h2>
        <span className="text-slate-400 text-sm">Ultimo aggiornamento: Oggi, 09:41</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <MetricCard key={m.name} metric={m} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-rfx-800 p-6 rounded-xl border border-rfx-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Andamento Finanziario</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-rfx-800 p-6 rounded-xl border border-rfx-700 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Progetti Attivi</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white text-sm">{project.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'In Corso' ? 'bg-blue-500/20 text-blue-400' :
                    project.status === 'Completato' ? 'bg-green-500/20 text-green-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Budget: €{(project.budget / 1000).toFixed(0)}k</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-dashed border-slate-600 text-slate-400 rounded hover:bg-slate-700/50 transition-colors text-sm">
            + Nuovo Progetto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;