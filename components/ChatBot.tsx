import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Salve. Sono RFX Advisor. Come posso assisterla oggi nella gestione della holding?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await sendChatMessage(messages, input);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling handled in service, but good to have fallback UI
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto bg-rfx-800 rounded-xl border border-rfx-700 shadow-2xl overflow-hidden animate-fade-in">
      {/* Chat Header */}
      <div className="bg-slate-900/50 p-4 border-b border-rfx-700 flex items-center gap-3">
        <div className="p-2 bg-blue-600/20 rounded-full text-blue-400">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            RFX Advisor <span className="text-xs bg-rfx-gold text-slate-900 px-2 py-0.5 rounded font-bold uppercase">Pro</span>
          </h3>
          <p className="text-slate-400 text-xs">Powered by Gemini 3.0</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-600' : 'bg-blue-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-slate-700 text-white rounded-tr-none' 
                  : 'bg-blue-900/40 border border-blue-800/50 text-slate-200 rounded-tl-none'
              }`}>
                <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className="text-[10px] opacity-50 block mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                 <Sparkles size={16} />
               </div>
               <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                 <Loader2 className="animate-spin text-blue-400" size={16} />
                 <span className="text-sm text-slate-400">RFX Advisor sta pensando...</span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-rfx-800 border-t border-rfx-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Chiedi informazioni strategiche o operative..."
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-inner"
            rows={1}
            style={{ minHeight: '60px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          Le risposte generate dall'AI possono variare. Verifica sempre i dati critici.
        </p>
      </div>
    </div>
  );
};

export default ChatBot;