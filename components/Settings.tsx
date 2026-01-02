import React, { useState, useEffect, useRef } from 'react';
import { 
    Database, Server, Save, RotateCcw, Shield, Bell, Key, 
    List, ChevronRight, ChevronDown, CheckSquare, Settings as SettingsIcon,
    Plus, Edit2, Trash2, X, Download, Upload, Monitor
} from 'lucide-react';
import { useBusinessContext } from '../contexts/BusinessContext';

// --- LOCAL MODAL FOR SETTINGS EDITING ---
interface SettingsModalProps {
    isOpen: boolean;
    title: string;
    initialValue?: string;
    placeholder?: string;
    onClose: () => void;
    onSave: (value: string) => void;
}
  
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, title, initialValue, placeholder, onClose, onSave }) => {
    const [value, setValue] = useState(initialValue || '');
    
    useEffect(() => { 
        if(isOpen) setValue(initialValue || '');
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
                <input 
                    type="text" 
                    value={value} 
                    onChange={e => setValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none mb-6"
                    placeholder={placeholder}
                    autoFocus
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">
                        Annulla
                    </button>
                    <button 
                        onClick={() => onSave(value)} 
                        disabled={!value.trim()}
                        className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold disabled:opacity-50"
                    >
                        Conferma
                    </button>
                </div>
            </div>
        </div>
    );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database'>('database');
  const [activeTemplateType, setActiveTemplateType] = useState<'company' | 'erp'>('company');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
      template,
      erpTemplate,
      addTemplateCategory, 
      updateTemplateCategory, 
      deleteTemplateCategory,
      addTemplateStep,
      updateTemplateStep,
      deleteTemplateStep,
      resetTemplate,
      downloadBackup,
      uploadBackup
  } = useBusinessContext();

  const currentTemplate = activeTemplateType === 'company' ? template : erpTemplate;

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
      isOpen: boolean;
      type: 'category' | 'step';
      mode: 'add' | 'edit';
      title: string;
      initialValue?: string;
      targetId?: string; // Category ID or Step Index (as string)
      parentId?: string; // Category ID for steps
  }>({ isOpen: false, type: 'category', mode: 'add', title: '' });

  const openAddCategory = () => {
      setModalConfig({
          isOpen: true,
          type: 'category',
          mode: 'add',
          title: `Nuova Sezione ${activeTemplateType === 'company' ? 'Azienda' : 'ERP'}`,
          initialValue: ''
      });
  };

  const openEditCategory = (id: string, name: string) => {
      setModalConfig({
          isOpen: true,
          type: 'category',
          mode: 'edit',
          title: 'Modifica Sezione',
          initialValue: name,
          targetId: id
      });
  };

  const openAddStep = (catId: string) => {
      setModalConfig({
          isOpen: true,
          type: 'step',
          mode: 'add',
          title: 'Nuovo Step Operativo',
          initialValue: '',
          parentId: catId
      });
  };

  const openEditStep = (catId: string, index: number, label: string) => {
      setModalConfig({
          isOpen: true,
          type: 'step',
          mode: 'edit',
          title: 'Modifica Step',
          initialValue: label,
          parentId: catId,
          targetId: index.toString()
      });
  };

  const handleModalSave = (value: string) => {
      const { type, mode, targetId, parentId } = modalConfig;

      if (type === 'category') {
          if (mode === 'add') {
              addTemplateCategory(value, activeTemplateType);
          } else if (mode === 'edit' && targetId) {
              updateTemplateCategory(targetId, value, activeTemplateType);
          }
      } else if (type === 'step' && parentId) {
          if (mode === 'add') {
              addTemplateStep(parentId, value, activeTemplateType);
          } else if (mode === 'edit' && targetId !== undefined) {
              updateTemplateStep(parentId, parseInt(targetId), value, activeTemplateType);
          }
      }
      setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const success = await uploadBackup(file);
      if (success) {
          alert('Database ripristinato con successo!');
      } else {
          alert('Errore durante il caricamento del file di backup.');
      }
      // Reset input
      e.target.value = '';
  };


  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in relative">
      <SettingsModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        initialValue={modalConfig.initialValue}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSave={handleModalSave}
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="text-slate-400" />
          Impostazioni Sistema
        </h2>
        <p className="text-slate-400 text-sm">Configurazione globale della piattaforma RFX Corp.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
        {/* Sidebar Menu */}
        <div className="lg:w-64 flex flex-col gap-2">
           <button 
             onClick={() => setActiveTab('general')}
             className={`px-4 py-3 rounded-lg text-left text-sm font-medium flex items-center gap-3 transition-all ${
               activeTab === 'general' ? 'bg-blue-600 text-white shadow-lg' : 'bg-rfx-800 text-slate-400 hover:bg-slate-700 hover:text-white'
             }`}
           >
             <Server size={18} /> Generale
           </button>
           <button 
             onClick={() => setActiveTab('database')}
             className={`px-4 py-3 rounded-lg text-left text-sm font-medium flex items-center gap-3 transition-all ${
               activeTab === 'database' ? 'bg-blue-600 text-white shadow-lg' : 'bg-rfx-800 text-slate-400 hover:bg-slate-700 hover:text-white'
             }`}
           >
             <Database size={18} /> Database & Template
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-rfx-800 rounded-2xl border border-rfx-700 shadow-xl overflow-hidden flex flex-col">
           
           {activeTab === 'general' && (
             <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
                <Server size={64} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Impostazioni Generali</h3>
                <p>Configurazione server, notifiche e sicurezza.</p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                   <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center opacity-50">
                      <Bell className="mx-auto mb-2" />
                      <span className="text-xs">Notifiche</span>
                   </div>
                   <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center opacity-50">
                      <Shield className="mx-auto mb-2" />
                      <span className="text-xs">Sicurezza</span>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'database' && (
             <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-700 bg-slate-900/30 flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Database className="text-blue-400" size={24} />
                                Gestione Dati Default
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Configura i template automatici e gestisci il backup dei dati.
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".json"
                                    className="hidden"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors border border-slate-600"
                                >
                                    <Upload size={16} /> Importa Database
                                </button>
                                <button 
                                    onClick={downloadBackup}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 font-bold shadow-lg transition-colors"
                                >
                                    <Download size={16} /> Scarica Backup
                                </button>
                        </div>
                   </div>

                   <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg self-start">
                        <button 
                            onClick={() => setActiveTemplateType('company')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                activeTemplateType === 'company' 
                                ? 'bg-slate-700 text-white shadow' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Building2 size={14} /> Template Aziende
                        </button>
                        <button 
                            onClick={() => setActiveTemplateType('erp')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                activeTemplateType === 'erp' 
                                ? 'bg-slate-700 text-white shadow' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Monitor size={14} /> Template ERP
                        </button>
                   </div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                   <div className="mb-6">
                      <div className="flex justify-between items-end mb-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            {activeTemplateType === 'company' ? <Building2 size={16} className="text-rfx-gold" /> : <Monitor size={16} className="text-blue-400" />}
                            {activeTemplateType === 'company' ? 'Struttura Default Holding/Aziende' : 'Struttura Default Software/ERP'}
                        </h4>
                        <button 
                            onClick={openAddCategory}
                            className="text-xs bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-600/50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                            <Plus size={14} /> Nuova Sezione
                        </button>
                      </div>
                      
                      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        {currentTemplate.length === 0 && (
                            <div className="p-8 text-center text-slate-500 text-sm italic">
                                Nessuna sezione definita nel template. Aggiungine una per iniziare.
                            </div>
                        )}
                        {currentTemplate.map((category, index) => (
                           <div key={category.id} className="border-b border-slate-800 last:border-0">
                              <div className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                                 <button 
                                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                    className="flex items-center gap-3 flex-1 text-left"
                                 >
                                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-mono font-bold">
                                       SEZIONE {index + 1}
                                    </span>
                                    <span className="font-semibold text-slate-200">{category.name}</span>
                                 </button>
                                 
                                 <div className="flex items-center gap-2">
                                     <div className="opacity-0 group-hover:opacity-100 flex gap-1 mr-2 transition-opacity">
                                        <button 
                                            onClick={() => openEditCategory(category.id, category.name)}
                                            className="p-1.5 hover:bg-blue-600 text-slate-500 hover:text-white rounded"
                                        ><Edit2 size={14}/></button>
                                        <button 
                                            onClick={() => deleteTemplateCategory(category.id, activeTemplateType)}
                                            className="p-1.5 hover:bg-red-600 text-slate-500 hover:text-white rounded"
                                        ><Trash2 size={14}/></button>
                                     </div>
                                     <button onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}>
                                        {expandedCategory === category.id ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
                                     </button>
                                 </div>
                              </div>
                              
                              {expandedCategory === category.id && (
                                 <div className="bg-slate-950/30 p-4 pl-12 border-t border-slate-800">
                                    <ul className="space-y-2 mb-4">
                                       {category.steps.map((step, sIndex) => (
                                          <li key={sIndex} className="flex items-center justify-between gap-3 text-sm text-slate-400 group/step p-1 hover:bg-slate-800/50 rounded">
                                             <div className="flex items-center gap-3">
                                                <CheckSquare size={14} className="text-slate-600" />
                                                {step}
                                             </div>
                                             <div className="opacity-0 group-hover/step:opacity-100 flex gap-1">
                                                <button 
                                                    onClick={() => openEditStep(category.id, sIndex, step)}
                                                    className="p-1 hover:text-blue-400 text-slate-600"
                                                ><Edit2 size={12}/></button>
                                                <button 
                                                    onClick={() => deleteTemplateStep(category.id, sIndex, activeTemplateType)}
                                                    className="p-1 hover:text-red-400 text-slate-600"
                                                ><Trash2 size={12}/></button>
                                             </div>
                                          </li>
                                       ))}
                                    </ul>
                                    <button 
                                        onClick={() => openAddStep(category.id)}
                                        className="text-xs text-blue-400 hover:text-white hover:underline flex items-center gap-1 opacity-70 hover:opacity-100"
                                    >
                                       <Plus size={12} /> Aggiungi Step a "{category.name}"
                                    </button>
                                 </div>
                              )}
                           </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end gap-3">
                         <button 
                            onClick={resetTemplate}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                         >
                            <RotateCcw size={16} /> Ripristina Default
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

// Helper components needed for icon usage within Settings, ensuring imports work
function Building2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>}

export default Settings;