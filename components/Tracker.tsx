import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  Package, 
  Users, 
  Plus, 
  Rocket, 
  Clock, 
  Briefcase,
  CheckSquare,
  Square,
  Trash2,
  Edit2,
  Network,
  List,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Save,
  Upload,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Monitor,
  Server
} from 'lucide-react';
import { TrackedEntity, EntityType, EntityStatus, DetailedCompany, CompanyCategory, CompanyStep } from '../types';
import { useBusinessContext } from '../contexts/BusinessContext';

// --- HELPERS ---
const getStatusColor = (status: EntityStatus) => {
  switch (status) {
    case 'Idea': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Pianificazione': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'Sviluppo': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Attivo': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

// --- SUB-COMPONENTS (Moved outside Tracker) ---

const SimpleEntityCard: React.FC<{ entity: TrackedEntity }> = ({ entity }) => {
    return (
      <div className="bg-rfx-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group flex flex-col justify-between h-full min-h-[200px]">
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                {entity.type === 'product' ? <Package size={24} /> : <Users size={24} />}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(entity.status)}`}>
                {entity.status}
                </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{entity.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{entity.description}</p>
        </div>
        
        <div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-4 overflow-hidden">
                <div 
                className="bg-blue-500 h-full rounded-full transition-all" 
                style={{ width: `${entity.progress}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Avviato: {new Date(entity.startDate).toLocaleDateString()}</span>
                <span>{entity.progress}%</span>
            </div>
        </div>
      </div>
    );
};

const OrgChartNode: React.FC<{ 
  company: DetailedCompany; 
  allCompanies: DetailedCompany[];
  onOpenWork: (id: string) => void;
  onEdit: (c: DetailedCompany) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId: string) => void;
  isErp?: boolean;
}> = ({ company, allCompanies, onOpenWork, onEdit, onDelete, onAdd, isErp }) => {
    const children = allCompanies.filter(c => c.parentId === company.id);
    const hasChildren = children.length > 0;
    
    const totalSteps = company.categories.reduce((acc, cat) => acc + cat.steps.length, 0);
    const totalCompleted = company.categories.reduce((acc, cat) => acc + cat.steps.filter(s => s.isCompleted).length, 0);
    const overallProgress = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

    return (
      <div className="flex flex-col items-center">
        <div 
            onClick={() => onOpenWork(company.id)}
            className={`
            relative z-10 
            w-64 p-0
            bg-slate-800 
            border-2 ${company.status === 'Attivo' ? 'border-blue-500' : 'border-slate-600'}
            rounded-2xl 
            shadow-xl shadow-slate-900/50
            transition-all duration-300
            group
            cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:border-blue-400/50
        `}>
            <div className="flex justify-between items-center p-2 border-b border-slate-700/50">
               {company.ownership !== undefined && !isErp ? (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                    {company.ownership}%
                  </span>
               ) : <span className="w-1"></span>}
               
               <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(company); }} className="p-1.5 hover:bg-blue-600 rounded text-slate-400 hover:text-white transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(company.id); }} className="p-1.5 hover:bg-red-600 rounded text-slate-400 hover:text-white transition-colors">
                    <Trash2 size={12} />
                  </button>
               </div>
            </div>

            <div className="p-4 flex flex-col items-center relative">
               <div className={`
                 w-12 h-12 rounded-xl mb-3 flex items-center justify-center overflow-hidden border-2 bg-slate-700/20
                 ${company.status === 'Attivo' ? 'border-blue-500/30' : 'border-slate-600'}
               `}>
                 {company.logo ? (
                   <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                 ) : (
                   isErp ? <Server size={20} className={company.status === 'Attivo' ? 'text-blue-400' : 'text-slate-400'} /> :
                   <Building size={20} className={company.status === 'Attivo' ? 'text-blue-400' : 'text-slate-400'} />
                 )}
               </div>

               <div className={`font-bold text-center leading-tight mb-3 text-lg ${company.status === 'Attivo' ? 'text-white' : 'text-slate-300'}`}>
                  {company.name}
               </div>
               
               <div className="w-full mb-2">
                 <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                   <span>Attività</span>
                   <span>{overallProgress}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${overallProgress}%` }}></div>
                 </div>
               </div>
               
               <div className="flex items-center gap-2">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(company.status)}`}>
                    {company.status}
                 </span>
               </div>
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
               <button 
                 onClick={(e) => { e.stopPropagation(); onAdd(company.id); }}
                 className="w-6 h-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 transition-transform hover:scale-110"
               >
                 <Plus size={14} />
               </button>
            </div>
        </div>

        {hasChildren && (
            <>
                <div className="w-0.5 h-8 bg-blue-500/50"></div>
                <div className="flex justify-center">
                        {children.map((child, index) => {
                            const isFirst = index === 0;
                            const isLast = index === children.length - 1;
                            const isOnly = children.length === 1;
                            
                            return (
                                <div key={child.id} className="flex flex-col items-center">
                                    <div className="h-8 w-full flex relative">
                                        <div className={`h-0.5 bg-blue-500/50 w-[50%] ${isFirst || isOnly ? 'opacity-0' : ''}`}></div>
                                        <div className={`h-0.5 bg-blue-500/50 w-[50%] ${isLast || isOnly ? 'opacity-0' : ''}`}></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-500/50"></div>
                                    </div>
                                    <div className="px-4">
                                       <OrgChartNode 
                                          company={child} 
                                          allCompanies={allCompanies} 
                                          onOpenWork={onOpenWork}
                                          onEdit={onEdit}
                                          onDelete={onDelete}
                                          onAdd={onAdd}
                                          isErp={isErp}
                                       />
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </>
        )}
      </div>
    );
};

const CompanyBuilderCard: React.FC<{ 
    company: DetailedCompany;
    onEdit: (c: DetailedCompany) => void;
    onDelete: (id: string, type: 'company' | 'category' | 'step', ctx?: any) => void;
    onManageItem: (cfg: any) => void;
    onToggleStep: (compId: string, catId: string, stepId: string) => void;
}> = ({ company, onEdit, onDelete, onManageItem, onToggleStep }) => {
    const [activeCatId, setActiveCatId] = useState<string>(company.categories[0]?.id);
    const activeCategory = company.categories.find(c => c.id === activeCatId);
    
    useEffect(() => {
        if (!activeCategory && company.categories.length > 0) {
            setActiveCatId(company.categories[0].id);
        }
    }, [company.categories, activeCategory]);

    const totalSteps = company.categories.reduce((acc, cat) => acc + cat.steps.length, 0);
    const totalCompleted = company.categories.reduce((acc, cat) => acc + cat.steps.filter(s => s.isCompleted).length, 0);
    const overallProgress = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

    return (
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8 shadow-2xl animate-fade-in">
        <div className="bg-slate-800/80 p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600">
               {company.logo ? (
                 <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
               ) : <Building className="text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(company.status)}`}>
                  {company.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
                <span className="text-xs text-slate-400">{overallProgress}% Completamento Globale</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => onEdit(company)} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-700/50 rounded-lg">
               <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(company.id, 'company')} className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-700/50 rounded-lg">
               <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 bg-rfx-800">
          <div className="flex flex-wrap gap-2 mb-6">
            {company.categories.map(cat => (
              <div key={cat.id} className="relative group/cat">
                <button
                    onClick={() => setActiveCatId(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCatId === cat.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    {cat.name}
                </button>
                <div className="absolute -top-3 -right-2 hidden group-hover/cat:flex gap-1 bg-slate-900 rounded-lg p-1 shadow-lg border border-slate-700 z-10">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onManageItem({ type: 'category', mode: 'edit', initialValue: cat.name, targetId: cat.id, contextIds: { companyId: company.id } }); }}
                        className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800"
                    >
                        <Edit2 size={10} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(cat.id, 'category', { companyId: company.id }); }}
                        className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    >
                        <Trash2 size={10} />
                    </button>
                </div>
              </div>
            ))}
            <button 
                onClick={() => onManageItem({ type: 'category', mode: 'add', placeholder: 'Es. Finanza, Legale...', contextIds: { companyId: company.id } })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 transition-all"
            >
               <FolderPlus size={16} /> Nuova Categoria
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden min-h-[200px]">
             {activeCategory ? (
                <>
                <div className="p-4 bg-blue-600/10 border-b border-blue-600/20 flex justify-between items-center">
                  <h4 className="font-bold text-blue-100 flex items-center gap-2">
                      <Briefcase size={16} />
                      {activeCategory.name}
                  </h4>
                  <button 
                    onClick={() => onManageItem({ type: 'step', mode: 'add', placeholder: 'Nuovo Step Operativo', contextIds: { companyId: company.id, categoryId: activeCategory.id } })}
                    className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors flex items-center gap-1 font-medium shadow-lg shadow-green-900/20"
                  >
                     <Plus size={12} /> Aggiungi Step
                  </button>
                </div>
                <div className="p-2">
                   {activeCategory.steps.length > 0 ? activeCategory.steps.map((step) => (
                     <div key={step.id} className="group flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-800 last:border-0">
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => onToggleStep(company.id, activeCategory.id, step.id)}>
                          {step.isCompleted ? (
                            <CheckSquare className="text-green-500 shrink-0" size={20} />
                          ) : (
                            <Square className="text-slate-600 group-hover:text-blue-500 shrink-0" size={20} />
                          )}
                          <span className={`text-sm ${step.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {step.label}
                          </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onManageItem({ type: 'step', mode: 'edit', initialValue: step.label, targetId: step.id, contextIds: { companyId: company.id, categoryId: activeCategory.id } })}
                            className="p-1.5 text-slate-500 hover:text-blue-400 bg-slate-800 rounded border border-slate-700 hover:border-blue-500/30"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => onDelete(step.id, 'step', { companyId: company.id, categoryId: activeCategory.id })}
                            className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-800 rounded border border-slate-700 hover:border-red-500/30"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                     </div>
                   )) : (
                       <div className="text-center py-8 text-slate-600 italic text-sm">
                           Nessuno step in questa categoria. Aggiungine uno per iniziare.
                       </div>
                   )}
                </div>
                </>
             ) : (
               <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <Briefcase size={32} className="mb-2 opacity-20" />
                  <p>Seleziona o crea una categoria per gestire i task.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
};

// ... (Modal components unchanged, removed from brevity in previous step but assumed present)

// --- MODAL COMPONENTS (Simple ones) ---

interface CompanyModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: Partial<DetailedCompany>;
  parentId?: string;
  isErp?: boolean; // New prop to adjust modal title/fields
  onClose: () => void;
  onSave: (data: Partial<DetailedCompany>) => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, mode, initialData, parentId, isErp, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<DetailedCompany>>({
    name: '',
    logo: '',
    ownership: 100,
    status: 'Idea'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        logo: '',
        ownership: 100,
        status: 'Idea',
        ...initialData
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, logo: imageUrl }));
    }
  };

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'add' ? <Plus className="text-blue-500" /> : <Edit2 className="text-blue-500" />}
            {mode === 'add' ? (isErp ? 'Nuovo Sistema ERP' : 'Nuova Azienda') : (isErp ? 'Modifica ERP' : 'Modifica Azienda')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{isErp ? 'Nome Software/Modulo' : 'Nome Azienda'}</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              placeholder={isErp ? "Es. RFX Management Core" : "Es. RFX Tech S.r.l."}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{isErp ? 'Logo Software' : 'Logo Aziendale'}</label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600 shrink-0 relative group">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => setFormData({...formData, logo: ''})}>
                        <X size={20} className="text-white"/>
                    </div>
                  </>
                ) : <ImageIcon size={24} className="text-slate-500" />}
              </div>
              <div className="flex-1">
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   onChange={handleFileChange}
                   accept="image/*"
                   className="hidden"
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm border border-slate-600 flex items-center justify-center gap-2 transition-colors"
                 >
                    <Upload size={14} /> Carica Immagine
                 </button>
                 <p className="text-[10px] text-slate-500 mt-1">PNG, JPG o GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs text-slate-400 mb-1">Stato</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as EntityStatus})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
                >
                  <option value="Idea">Idea</option>
                  <option value="Pianificazione">Pianificazione</option>
                  <option value="Sviluppo">Sviluppo</option>
                  <option value="Attivo">Attivo</option>
                  {isErp ? <option value="Deprecated">Deprecato</option> : <option value="Exit">Exit</option>}
                </select>
             </div>
             {parentId && !isErp && (
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Quota Posseduta (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={formData.ownership} 
                    onChange={e => setFormData({...formData, ownership: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
                  />
               </div>
             )}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors">
            Annulla
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={!formData.name}
            className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
};

interface ManageItemModalProps {
  isOpen: boolean;
  title: string;
  initialValue?: string;
  placeholder?: string;
  onClose: () => void;
  onSave: (value: string) => void;
}
const ManageItemModal: React.FC<ManageItemModalProps> = ({ isOpen, title, initialValue, placeholder, onClose, onSave }) => {
    const [value, setValue] = useState(initialValue || '');
    useEffect(() => { if(isOpen) setValue(initialValue || ''); }, [isOpen, initialValue]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
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
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">Annulla</button>
                    <button onClick={() => onSave(value)} disabled={!value.trim()} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold disabled:opacity-50">Conferma</button>
                </div>
            </div>
        </div>
    );
};
interface DeleteModalProps {
  isOpen: boolean;
  step: 1 | 2;
  onClose: () => void;
  onConfirm: () => void;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, step, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
       <div className="bg-slate-800 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
          <h3 className="text-xl font-bold text-white mb-2">{step === 1 ? 'Eliminare Elemento?' : 'Sei davvero sicuro?'}</h3>
          <p className="text-slate-400 text-sm mb-6">{step === 1 ? 'Questa azione è irreversibile.' : 'ATTENZIONE: Verranno eliminati anche tutti i dati collegati.'}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">Annulla</button>
            <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold">{step === 1 ? 'Elimina' : 'Conferma Eliminazione'}</button>
          </div>
       </div>
    </div>
  );
};

interface CompanyWorkModalProps {
  isOpen: boolean;
  companyId: string | null;
  companies: DetailedCompany[];
  onClose: () => void;
  onEdit: (c: DetailedCompany) => void;
  onManageItem: (cfg: any) => void;
  onDelete: (id: string, type: 'company' | 'category' | 'step', ctx?: any) => void;
  onToggleStep: (compId: string, catId: string, stepId: string) => void;
}

const CompanyWorkModal: React.FC<CompanyWorkModalProps> = ({ isOpen, companyId, companies, onClose, onEdit, onManageItem, onDelete, onToggleStep }) => {
    if (!isOpen || !companyId) return null;
    const company = companies.find(c => c.id === companyId);
    if (!company) return null;

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute -top-12 right-0 md:-right-12 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-colors z-50">
                    <X size={24} />
                </button>
                <div className="overflow-y-auto custom-scrollbar rounded-xl shadow-2xl">
                     <CompanyBuilderCard 
                        company={company}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onManageItem={onManageItem}
                        onToggleStep={onToggleStep}
                     />
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const Tracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EntityType>('company');
  const [viewMode, setViewMode] = useState<'list' | 'hierarchy'>('hierarchy');
  
  // Use Context for Templates and Data
  const { 
    template,
    erpTemplate, 
    companies, 
    setCompanies,
    erpSystems,
    setErpSystems,
    simpleEntities, 
    setSimpleEntities 
  } = useBusinessContext();

  // --- MODAL STATE MANAGEMENT ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    targetId?: string; 
    data?: Partial<DetailedCompany>;
  }>({ isOpen: false, mode: 'add' });

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    step: 1 | 2;
    targetId?: string;
    type: 'company' | 'category' | 'step';
    contextIds?: { companyId: string, categoryId?: string }; 
  }>({ isOpen: false, step: 1, type: 'company' });

  const [manageItemState, setManageItemState] = useState<{
      isOpen: boolean;
      type: 'category' | 'step';
      mode: 'add' | 'edit';
      targetId?: string;
      contextIds: { companyId: string, categoryId?: string };
      initialValue?: string;
      placeholder?: string;
  }>({ isOpen: false, type: 'category', mode: 'add', contextIds: { companyId: '' } });

  const [workModalState, setWorkModalState] = useState<{
    isOpen: boolean;
    companyId: string | null;
  }>({ isOpen: false, companyId: null });

  // --- HANDLERS ---

  const openAddModal = (parentId?: string) => {
    setModalState({
      isOpen: true,
      mode: 'add',
      targetId: parentId,
      data: { name: '', logo: '', ownership: parentId ? 100 : undefined, status: 'Idea' }
    });
  };

  const openEditModal = (company: DetailedCompany) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      targetId: company.id,
      data: { ...company }
    });
  };

  const openDeleteModal = (id: string, type: 'company' | 'category' | 'step', contextIds?: any) => {
    setDeleteState({ isOpen: true, step: 1, targetId: id, type, contextIds });
  };

  const openManageItem = (config: any) => {
      setManageItemState({ ...config, isOpen: true });
  };

  const openWorkModal = (id: string) => {
      setWorkModalState({ isOpen: true, companyId: id });
  };

  const handleSaveCompany = (data: Partial<DetailedCompany>) => {
    const isErpMode = activeTab === 'erp';
    const targetSetState = isErpMode ? setErpSystems : setCompanies;
    const targetState = isErpMode ? erpSystems : companies;
    const targetTemplate = isErpMode ? erpTemplate : template;

    if (modalState.mode === 'add') {
      // Use the DYNAMIC template from Context
      const defaultCategories: CompanyCategory[] = targetTemplate.map((tplCat, idx) => ({
        id: `cat-${Date.now()}-${idx}`,
        name: tplCat.name,
        progress: 0,
        steps: tplCat.steps.map((stepLabel, sIdx) => ({
          id: `step-${Date.now()}-${idx}-${sIdx}`,
          label: stepLabel,
          isCompleted: false
        }))
      }));

      const newCompany: DetailedCompany = {
        id: Date.now().toString(),
        name: data.name || (isErpMode ? 'Nuovo Sistema ERP' : 'Nuova Azienda'),
        parentId: modalState.targetId,
        ownership: data.ownership,
        status: data.status || 'Idea',
        logo: data.logo,
        categories: defaultCategories
      };
      targetSetState([...targetState, newCompany]);
    } else if (modalState.mode === 'edit' && modalState.targetId) {
      targetSetState(targetState.map(c => 
        c.id === modalState.targetId ? { ...c, ...data } : c
      ));
    }
    setModalState({ ...modalState, isOpen: false });
  };
  
  const handleManageItemSave = (value: string) => {
      const { type, mode, targetId, contextIds } = manageItemState;
      const { companyId, categoryId } = contextIds;

      const isErpMode = activeTab === 'erp';
      const targetSetState = isErpMode ? setErpSystems : setCompanies;

      targetSetState(prev => prev.map(comp => {
          if (comp.id !== companyId) return comp;

          if (type === 'category') {
              if (mode === 'add') {
                  const newCategory: CompanyCategory = {
                      id: `cat-${Date.now()}`,
                      name: value,
                      progress: 0,
                      steps: []
                  };
                  return { ...comp, categories: [...comp.categories, newCategory] };
              } else if (mode === 'edit' && targetId) {
                  return {
                      ...comp,
                      categories: comp.categories.map(cat => cat.id === targetId ? { ...cat, name: value } : cat)
                  };
              }
          }

          if (type === 'step' && categoryId) {
               return {
                   ...comp,
                   categories: comp.categories.map(cat => {
                       if (cat.id !== categoryId) return cat;
                       
                       if (mode === 'add') {
                           const newStep: CompanyStep = {
                               id: `step-${Date.now()}`,
                               label: value,
                               isCompleted: false
                           };
                           const updatedSteps = [...cat.steps, newStep];
                           const completed = updatedSteps.filter(s => s.isCompleted).length;
                           const progress = updatedSteps.length > 0 ? Math.round((completed / updatedSteps.length) * 100) : 0;
                           return { ...cat, steps: updatedSteps, progress };
                       } else if (mode === 'edit' && targetId) {
                           const updatedSteps = cat.steps.map(s => s.id === targetId ? { ...s, label: value } : s);
                           return { ...cat, steps: updatedSteps };
                       }
                       return cat;
                   })
               };
          }

          return comp;
      }));

      setManageItemState({ ...manageItemState, isOpen: false });
  };


  const confirmDelete = () => {
    const { type, targetId, contextIds } = deleteState;
    const isErpMode = activeTab === 'erp';
    const targetSetState = isErpMode ? setErpSystems : setCompanies;
    const targetState = isErpMode ? erpSystems : companies;

    if (type === 'company') {
        if (deleteState.step === 1) {
            setDeleteState({ ...deleteState, step: 2 });
            return;
        }
        const idsToDelete = new Set<string>();
        const collectIds = (id: string) => {
            idsToDelete.add(id);
            // Only traverse hierarchy for companies, ERPs are flat lists usually
            if (!isErpMode) {
                targetState.filter(c => c.parentId === id).forEach(child => collectIds(child.id));
            } else {
                 targetState.filter(c => c.parentId === id).forEach(child => collectIds(child.id));
            }
        };
        if (targetId) {
            collectIds(targetId);
            targetSetState(targetState.filter(c => !idsToDelete.has(c.id)));
        }
    } else if (type === 'category' && contextIds?.companyId && targetId) {
        targetSetState(prev => prev.map(comp => {
            if (comp.id !== contextIds.companyId) return comp;
            return { ...comp, categories: comp.categories.filter(c => c.id !== targetId) };
        }));
    } else if (type === 'step' && contextIds?.companyId && contextIds?.categoryId && targetId) {
        targetSetState(prev => prev.map(comp => {
            if (comp.id !== contextIds.companyId) return comp;
            return {
                ...comp,
                categories: comp.categories.map(cat => {
                    if (cat.id !== contextIds.categoryId) return cat;
                    const updatedSteps = cat.steps.filter(s => s.id !== targetId);
                    const completed = updatedSteps.filter(s => s.isCompleted).length;
                    const progress = updatedSteps.length > 0 ? Math.round((completed / updatedSteps.length) * 100) : 0;
                    return { ...cat, steps: updatedSteps, progress };
                })
            };
        }));
    }

    setDeleteState({ isOpen: false, step: 1, type: 'company' });
  };

  const toggleStep = (companyId: string, categoryId: string, stepId: string) => {
    const isErpMode = activeTab === 'erp';
    const targetSetState = isErpMode ? setErpSystems : setCompanies;

    targetSetState(prev => prev.map(comp => {
      if (comp.id !== companyId) return comp;
      
      const newCategories = comp.categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        
        const newSteps = cat.steps.map(step => 
          step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
        );
        
        const completed = newSteps.filter(s => s.isCompleted).length;
        const progress = newSteps.length > 0 ? Math.round((completed / newSteps.length) * 100) : 0;
        
        return { ...cat, steps: newSteps, progress };
      });
      
      return { ...comp, categories: newCategories };
    }));
  };

  // --- RENDER ---
  const currentData = activeTab === 'erp' ? erpSystems : companies;
  const roots = currentData.filter(c => !c.parentId);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <CompanyModal 
        isOpen={modalState.isOpen} 
        mode={modalState.mode} 
        initialData={modalState.data}
        parentId={modalState.mode === 'add' ? modalState.targetId : undefined}
        isErp={activeTab === 'erp'}
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
        onSave={handleSaveCompany} 
      />
      <DeleteModal 
        isOpen={deleteState.isOpen} 
        step={deleteState.step}
        onClose={() => setDeleteState({ ...deleteState, isOpen: false })}
        onConfirm={confirmDelete}
      />
      <ManageItemModal
        isOpen={manageItemState.isOpen}
        title={manageItemState.type === 'category' ? 
            (manageItemState.mode === 'add' ? 'Nuova Categoria' : 'Rinomina Categoria') : 
            (manageItemState.mode === 'add' ? 'Nuovo Step' : 'Modifica Step')
        }
        initialValue={manageItemState.initialValue}
        placeholder={manageItemState.placeholder}
        onClose={() => setManageItemState({ ...manageItemState, isOpen: false })}
        onSave={handleManageItemSave}
      />
      <CompanyWorkModal 
        isOpen={workModalState.isOpen}
        companyId={workModalState.companyId}
        companies={activeTab === 'erp' ? erpSystems : companies}
        onClose={() => setWorkModalState({ isOpen: false, companyId: null })}
        onEdit={openEditModal}
        onManageItem={openManageItem}
        onDelete={openDeleteModal}
        onToggleStep={toggleStep}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Rocket className="text-rfx-accent" />
            Business Tracker
          </h2>
          <p className="text-slate-400 text-sm mt-1">Gestione operativa strutturata delle Holdings e Assets.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end border-b border-rfx-800 pb-1 mb-6 gap-4">
        <div className="flex space-x-2 overflow-x-auto">
            {(['company', 'erp', 'product', 'partner'] as EntityType[]).map((type) => (
            <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                activeTab === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-rfx-800 text-slate-400 hover:text-slate-200 hover:bg-rfx-700'
                }`}
            >
                {type === 'company' && <Building size={18} />}
                {type === 'erp' && <Monitor size={18} />}
                {type === 'product' && <Package size={18} />}
                {type === 'partner' && <Users size={18} />}
                <span className="capitalize">
                {type === 'company' ? 'Aziende & Holdings' : type === 'erp' ? 'ERP Systems' : type === 'product' ? 'Prodotti' : 'Soci'}
                </span>
            </button>
            ))}
        </div>

        {(activeTab === 'company' || activeTab === 'erp') && (
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 mb-2">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded flex items-center gap-2 text-sm transition-all ${
                        viewMode === 'list' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <List size={16} /> <span className="hidden sm:inline">Builder</span>
                </button>
                <button 
                    onClick={() => setViewMode('hierarchy')}
                    className={`p-2 rounded flex items-center gap-2 text-sm transition-all ${
                        viewMode === 'hierarchy' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Network size={16} /> <span className="hidden sm:inline">Gerarchia</span>
                </button>
            </div>
        )}
      </div>

      <div className="min-h-[500px]">
        {(activeTab === 'company' || activeTab === 'erp') ? (
          viewMode === 'hierarchy' ? (
              <div className="w-full overflow-x-auto overflow-y-hidden bg-slate-900/50 rounded-xl border border-dashed border-slate-700 p-8 min-h-[600px] flex justify-center items-start custom-scrollbar relative">
                {roots.length === 0 && (
                    <button 
                    onClick={() => openAddModal()} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
                        <Plus size={32} />
                        </div>
                        <span>{activeTab === 'company' ? 'Crea la prima Holding' : 'Inizia Architettura ERP'}</span>
                    </button>
                )}
                {roots.map(root => (
                    <OrgChartNode 
                        key={root.id} 
                        company={root} 
                        allCompanies={currentData} 
                        onOpenWork={openWorkModal}
                        onEdit={openEditModal}
                        onDelete={(id) => openDeleteModal(id, 'company')}
                        onAdd={openAddModal}
                        isErp={activeTab === 'erp'}
                    />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
                 {activeTab === 'erp' && (
                     <div className="flex justify-end">
                         <button 
                             onClick={() => openAddModal()}
                             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all"
                         >
                             <Plus size={20} /> Nuovo Sistema ERP
                         </button>
                     </div>
                 )}
                {currentData.length > 0 ? currentData.map(item => (
                  <CompanyBuilderCard 
                    key={item.id} 
                    company={item} 
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onManageItem={openManageItem}
                    onToggleStep={toggleStep}
                  />
                )) : (
                  <div className="text-center py-20 text-slate-500">
                    {activeTab === 'company' ? 'Nessuna azienda presente.' : 'Nessun sistema ERP tracciato.'} Passa alla vista Gerarchia per creare il primo elemento.
                  </div>
                )}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simpleEntities
              .filter(e => e.type === activeTab)
              .map(entity => (
                <SimpleEntityCard key={entity.id} entity={entity} />
            ))}
            <button className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all min-h-[280px]">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Plus size={32} />
              </div>
              <span className="font-semibold">Aggiungi {activeTab === 'partner' ? 'Socio' : 'Prodotto'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;