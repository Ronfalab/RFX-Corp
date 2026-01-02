import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TemplateCategory, DetailedCompany, TrackedEntity } from '../types';

// --- INITIAL DATA ---

const INITIAL_TEMPLATE_COMPANY: TemplateCategory[] = [
  {
    id: 'tpl_cat_1',
    name: 'Costituzione',
    steps: [
      'Definizione strategia holding',
      'Scelta forma giuridica (SRL)',
      'Redazione atto costitutivo',
      'Apertura conto bancario',
      'Versamento capitale sociale',
      'Rogito notarile',
      'Iscrizione Camera di Commercio',
      'Richiesta Partita IVA',
      'Apertura posizione INPS/INAIL'
    ]
  },
  {
    id: 'tpl_cat_2',
    name: 'Immagine Coordinata',
    steps: [
      'Creazione logo e brand identity',
      'Sviluppo sito web corporate',
      'Design carta intestata e materiali',
      'Apertura profili social (LinkedIn)',
      'Strategia di comunicazione holding',
      'Piano editoriale e content strategy'
    ]
  },
  {
    id: 'tpl_cat_3',
    name: 'Struttura Commerciale',
    steps: [
      'Definizione strategia commerciale holding',
      'Struttura governance e investimenti',
      'Piano di acquisizione società',
      'Modello di valutazione investimenti',
      'Materiali investor relations',
      'KPI e obiettivi strategici holding'
    ]
  },
  {
    id: 'tpl_cat_4',
    name: 'Sistema CRM',
    steps: [
      'Analisi esigenze gestione partecipazioni',
      'Scelta piattaforma ERP/CRM holding',
      'Configurazione dashboard consolidata',
      'Integrazione con sistemi controllate',
      'Formazione team holding su sistemi',
      'Reporting e analytics consolidati'
    ]
  }
];

const INITIAL_TEMPLATE_ERP: TemplateCategory[] = [
  {
    id: 'erp_tpl_core',
    name: 'Architettura & Backend',
    steps: [
      'Setup Ambiente Cloud (AWS/Azure)',
      'Progettazione Database Relazionale (SQL)',
      'Implementazione API Gateway',
      'Sistema di Autenticazione (SSO/JWT)',
      'Configurazione Backup Automatici'
    ]
  },
  {
    id: 'erp_tpl_sales',
    name: 'Modulo Vendite & CRM',
    steps: [
      'Gestione Anagrafica Clienti',
      'Pipeline Opportunità e Lead',
      'Motore Calcolo Preventivi',
      'Generazione Ordini e Contratti',
      'Sincronizzazione Magazzino'
    ]
  },
  {
    id: 'erp_tpl_partners',
    name: 'Gestione Rete & Provvigioni',
    steps: [
      'Anagrafica Agenti e Gerarchie',
      'Motore Calcolo Provvigioni (Engine)',
      'Sistema di Fatturazione Automatica Agenti',
      'Gestione Mandati e Contratti',
      'Portale Self-Service Partner'
    ]
  },
  {
    id: 'erp_tpl_app',
    name: 'App Agenti (Mobile)',
    steps: [
      'UX/UI Design Mobile',
      'Sviluppo Modulo Presa Ordini Offline',
      'Geolocalizzazione e Giro Visite',
      'Catalogo Digitale Interattivo',
      'Integrazione Firma Digitale'
    ]
  }
];

const INITIAL_COMPANIES: DetailedCompany[] = [
  {
    id: 'c1',
    name: 'RFX Corp',
    status: 'Attivo',
    logo: 'https://ui-avatars.com/api/?name=RFX+Corp&background=0D8ABC&color=fff&size=128',
    categories: [
      {
        id: 'cat1',
        name: 'Costituzione',
        progress: 100,
        steps: [
          { id: 's1', label: 'Definizione strategia holding', isCompleted: true },
          { id: 's2', label: 'Scelta forma giuridica', isCompleted: true },
          { id: 's3', label: 'Rogito notarile', isCompleted: true },
        ]
      }
    ]
  },
  {
    id: 'c2',
    name: 'Digital2Web S.r.l.',
    parentId: 'c1', 
    ownership: 100,
    status: 'Pianificazione',
    categories: []
  },
  {
    id: 'c3',
    name: 'Local Consulting',
    parentId: 'c2', 
    ownership: 80,
    status: 'Idea',
    categories: []
  },
  {
    id: 'c4',
    name: 'RFX Real Estate',
    parentId: 'c1', 
    ownership: 51,
    status: 'Sviluppo',
    categories: []
  },
  {
    id: 'c5',
    name: 'RFX Academy',
    parentId: 'c1',
    ownership: 100,
    status: 'Idea',
    categories: []
  }
];

// Complex ERP Structure for Sales/Agents/Partners
const INITIAL_ERP_SYSTEMS: DetailedCompany[] = [
    {
        id: 'erp_core',
        name: 'RFX Omni-ERP Core',
        status: 'Sviluppo',
        logo: 'https://ui-avatars.com/api/?name=ERP+Core&background=1e293b&color=3b82f6&size=128',
        categories: [
            {
                id: 'ecat1',
                name: 'Architettura & Backend',
                progress: 60,
                steps: [
                    { id: 'es1', label: 'Setup Ambiente Cloud (AWS)', isCompleted: true },
                    { id: 'es2', label: 'Progettazione Database', isCompleted: true },
                    { id: 'es3', label: 'Sistema di Autenticazione', isCompleted: true },
                    { id: 'es4', label: 'Implementazione API Gateway', isCompleted: false },
                ]
            }
        ]
    },
    {
        id: 'erp_dashboard',
        name: 'HQ Web Dashboard',
        parentId: 'erp_core',
        ownership: 100, // Logic ownership/dependency
        status: 'Attivo',
        logo: 'https://ui-avatars.com/api/?name=HQ+Web&background=3b82f6&color=fff&size=128',
        categories: [
             {
                id: 'ecat_dash_1',
                name: 'Modulo Vendite & CRM',
                progress: 80,
                steps: [
                    { id: 'd1', label: 'Gestione Anagrafica Clienti', isCompleted: true },
                    { id: 'd2', label: 'Pipeline Opportunità', isCompleted: true },
                    { id: 'd3', label: 'Motore Calcolo Preventivi', isCompleted: true },
                    { id: 'd4', label: 'Analisi Statistiche Avanzate', isCompleted: false },
                ]
            }
        ]
    },
    {
        id: 'erp_partner',
        name: 'Partner Portal',
        parentId: 'erp_core',
        ownership: 100,
        status: 'Pianificazione',
        logo: 'https://ui-avatars.com/api/?name=Partner+Portal&background=10b981&color=fff&size=128',
        categories: [
            {
                id: 'ecat_part_1',
                name: 'Gestione Rete & Provvigioni',
                progress: 20,
                steps: [
                    { id: 'p1', label: 'Portale Self-Service Partner', isCompleted: false },
                    { id: 'p2', label: 'Visualizzazione Provvigioni', isCompleted: false },
                    { id: 'p3', label: 'Download Materiale Marketing', isCompleted: true },
                ]
            }
        ]
    },
    {
        id: 'erp_agent_app',
        name: 'Agent Sales App',
        parentId: 'erp_core',
        ownership: 100,
        status: 'Sviluppo',
        logo: 'https://ui-avatars.com/api/?name=Agent+App&background=f59e0b&color=fff&size=128',
        categories: [
            {
                id: 'ecat_app_1',
                name: 'App Agenti (Mobile)',
                progress: 40,
                steps: [
                    { id: 'a1', label: 'UX/UI Design Mobile', isCompleted: true },
                    { id: 'a2', label: 'Catalogo Digitale Interattivo', isCompleted: true },
                    { id: 'a3', label: 'Sviluppo Modulo Presa Ordini Offline', isCompleted: false },
                    { id: 'a4', label: 'Geolocalizzazione', isCompleted: false },
                ]
            }
        ]
    }
];

const INITIAL_SIMPLE_ENTITIES: TrackedEntity[] = [
  {
    id: 'p1',
    type: 'product',
    name: 'RFX Wallet',
    status: 'Sviluppo',
    description: 'App di gestione finanziaria decentralizzata.',
    progress: 45,
    startDate: '2024-02-01'
  }
];

interface BusinessContextType {
  // Template Management
  template: TemplateCategory[]; // Company Template
  erpTemplate: TemplateCategory[]; // ERP Template
  addTemplateCategory: (name: string, type: 'company' | 'erp') => void;
  updateTemplateCategory: (id: string, name: string, type: 'company' | 'erp') => void;
  deleteTemplateCategory: (id: string, type: 'company' | 'erp') => void;
  addTemplateStep: (categoryId: string, stepLabel: string, type: 'company' | 'erp') => void;
  updateTemplateStep: (categoryId: string, stepIndex: number, newLabel: string, type: 'company' | 'erp') => void;
  deleteTemplateStep: (categoryId: string, stepIndex: number, type: 'company' | 'erp') => void;
  resetTemplate: () => void;

  // Data Management
  companies: DetailedCompany[];
  setCompanies: React.Dispatch<React.SetStateAction<DetailedCompany[]>>;
  erpSystems: DetailedCompany[]; // Reusing DetailedCompany structure for ERPs
  setErpSystems: React.Dispatch<React.SetStateAction<DetailedCompany[]>>;
  simpleEntities: TrackedEntity[];
  setSimpleEntities: React.Dispatch<React.SetStateAction<TrackedEntity[]>>;

  // Backup
  downloadBackup: () => void;
  uploadBackup: (file: File) => Promise<boolean>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [template, setTemplate] = useState<TemplateCategory[]>(INITIAL_TEMPLATE_COMPANY);
  const [erpTemplate, setErpTemplate] = useState<TemplateCategory[]>(INITIAL_TEMPLATE_ERP);
  
  const [companies, setCompanies] = useState<DetailedCompany[]>(INITIAL_COMPANIES);
  const [erpSystems, setErpSystems] = useState<DetailedCompany[]>(INITIAL_ERP_SYSTEMS);
  const [simpleEntities, setSimpleEntities] = useState<TrackedEntity[]>(INITIAL_SIMPLE_ENTITIES);

  // Template Actions
  const addTemplateCategory = (name: string, type: 'company' | 'erp') => {
    const newCat: TemplateCategory = {
      id: `${type}_tpl_cat_${Date.now()}`,
      name,
      steps: []
    };
    if (type === 'company') setTemplate([...template, newCat]);
    else setErpTemplate([...erpTemplate, newCat]);
  };

  const updateTemplateCategory = (id: string, name: string, type: 'company' | 'erp') => {
    if (type === 'company') setTemplate(template.map(cat => cat.id === id ? { ...cat, name } : cat));
    else setErpTemplate(erpTemplate.map(cat => cat.id === id ? { ...cat, name } : cat));
  };

  const deleteTemplateCategory = (id: string, type: 'company' | 'erp') => {
    if (type === 'company') setTemplate(template.filter(cat => cat.id !== id));
    else setErpTemplate(erpTemplate.filter(cat => cat.id !== id));
  };

  const addTemplateStep = (categoryId: string, stepLabel: string, type: 'company' | 'erp') => {
    const updateFn = (list: TemplateCategory[]) => list.map(cat => {
      if (cat.id !== categoryId) return cat;
      return { ...cat, steps: [...cat.steps, stepLabel] };
    });
    if (type === 'company') setTemplate(updateFn(template));
    else setErpTemplate(updateFn(erpTemplate));
  };

  const updateTemplateStep = (categoryId: string, stepIndex: number, newLabel: string, type: 'company' | 'erp') => {
    const updateFn = (list: TemplateCategory[]) => list.map(cat => {
      if (cat.id !== categoryId) return cat;
      const newSteps = [...cat.steps];
      newSteps[stepIndex] = newLabel;
      return { ...cat, steps: newSteps };
    });
    if (type === 'company') setTemplate(updateFn(template));
    else setErpTemplate(updateFn(erpTemplate));
  };

  const deleteTemplateStep = (categoryId: string, stepIndex: number, type: 'company' | 'erp') => {
    const updateFn = (list: TemplateCategory[]) => list.map(cat => {
      if (cat.id !== categoryId) return cat;
      const newSteps = cat.steps.filter((_, idx) => idx !== stepIndex);
      return { ...cat, steps: newSteps };
    });
    if (type === 'company') setTemplate(updateFn(template));
    else setErpTemplate(updateFn(erpTemplate));
  };

  const resetTemplate = () => {
    setTemplate(INITIAL_TEMPLATE_COMPANY);
    setErpTemplate(INITIAL_TEMPLATE_ERP);
  };

  // Backup Actions
  const downloadBackup = () => {
    const data = {
      version: '1.2', // Bumped version for new ERP data
      timestamp: new Date().toISOString(),
      data: {
        template,
        erpTemplate,
        companies,
        erpSystems,
        simpleEntities
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rfx_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      if (!json.data) throw new Error("Invalid backup format");

      if (json.data.template) setTemplate(json.data.template);
      if (json.data.erpTemplate) setErpTemplate(json.data.erpTemplate);
      if (json.data.companies) setCompanies(json.data.companies);
      if (json.data.erpSystems) setErpSystems(json.data.erpSystems);
      if (json.data.simpleEntities) setSimpleEntities(json.data.simpleEntities);
      
      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  };

  return (
    <BusinessContext.Provider value={{
      template,
      erpTemplate,
      addTemplateCategory,
      updateTemplateCategory,
      deleteTemplateCategory,
      addTemplateStep,
      updateTemplateStep,
      deleteTemplateStep,
      resetTemplate,
      companies,
      setCompanies,
      erpSystems,
      setErpSystems,
      simpleEntities,
      setSimpleEntities,
      downloadBackup,
      uploadBackup
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
};