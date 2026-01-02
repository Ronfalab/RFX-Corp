import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, FileText } from 'lucide-react';
import { analyzeBusinessText } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const StrategicAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnalysis(null);
    
    try {
      const result = await analyzeBusinessText(input);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Errore durante l'analisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Sparkles className="text-rfx-gold" />
          RFX Intelligence Core
        </h2>
        <p className="text-slate-400">
          Utilizza la potenza di Gemini 3 Pro per analizzare report, email, o dati strategici.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-rfx-800 p-6 rounded-xl border border-rfx-700 shadow-lg flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={18} /> Dati di Input
          </h3>
          <textarea
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
            placeholder="Incolla qui il testo del report trimestrale, una mail importante, o i dati grezzi della strategia di marketing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                loading || !input.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Analisi in corso...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Genera Analisi Strategica
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-rfx-800 p-6 rounded-xl border border-rfx-700 shadow-lg h-[500px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Risultato Analisi</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 rounded-lg p-6 border border-slate-700/50">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-sm animate-pulse">Elaborazione intelligence...</p>
              </div>
            ) : analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <ArrowRight size={40} className="mb-4 opacity-20" />
                <p>I risultati appariranno qui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicAnalyzer;