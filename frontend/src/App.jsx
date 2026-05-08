import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trophy, Target, Shield, ChevronRight, Send, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [view, setView] = useState('hub'); // hub, simulator, analysis
  const [scenarios, setScenarios] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await axios.get(`${API_BASE}/scenarios`);
      setScenarios(res.data);
    } catch (err) {
      console.error("Failed to fetch scenarios", err);
    }
  };

  const startNegotiation = async (title) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/session/start?scenario_title=${encodeURIComponent(title)}`);
      setCurrentSession(res.data);
      setMessages([]);
      setView('simulator');
    } catch (err) {
      console.error("Failed to start session", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/session/${currentSession.session_id}/message`, userMsg);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/session/${currentSession.session_id}/complete`);
      setReport(res.data);
      setView('analysis');
    } catch (err) {
      console.error("Failed to complete session", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">FUELIX</h1>
          <p className="text-slate-400">AI-Powered Negotiation Simulation Engine</p>
        </div>
        {view !== 'hub' && (
          <button onClick={() => setView('hub')} className="text-sm text-slate-400 hover:text-white transition-colors">
            Exit Session
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {view === 'hub' && (
          <motion.div 
            key="hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {scenarios.map(s => (
              <div key={s.title} className="glass-card hover:border-cyan-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    s.difficulty === 'Novice' ? 'border-green-500 text-green-500' :
                    s.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }`}>
                    {s.difficulty}
                  </span>
                  <MessageSquare className="w-5 h-5 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3">{s.description}</p>
                <button 
                  onClick={() => startNegotiation(s.title)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Enter Arena <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {view === 'simulator' && (
          <motion.div 
            key="simulator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[70vh]"
          >
            <div className="glass-card flex-1 overflow-hidden flex flex-col mb-4">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Shield className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold">{currentSession?.scenario.ai_role}</p>
                    <p className="text-xs text-slate-400">Negotiation in progress</p>
                  </div>
                </div>
                <button onClick={completeSession} className="text-xs px-3 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20">
                  End & Analyze
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 mb-8">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Your Objective</p>
                  <p className="text-sm">{currentSession?.scenario.user_objective}</p>
                </div>

                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      m.role === 'user' 
                      ? 'bg-cyan-500 text-black font-medium' 
                      : 'glass-card !p-4 !rounded-2xl border-none bg-white/5'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="glass-card !p-4 !rounded-2xl border-none bg-white/5 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="text-sm text-slate-400 italic">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 flex gap-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your response..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                />
                <button 
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="btn-primary !p-3 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'analysis' && report && (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="glass-card text-center py-12 border-cyan-500/30">
              <div className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold">{report.overall_score}%</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Performance Analysis</h2>
              <p className="text-slate-400">Simulation Complete</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" /> Tactical Breakdown
                </h3>
                <div className="space-y-6">
                  {report.metrics.map(m => (
                    <div key={m.metric}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{m.metric}</span>
                        <span className="text-sm text-cyan-400">{m.score}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${m.score}%` }}
                          className="h-full bg-cyan-500"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> Strategic Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-green-500 uppercase mb-2">Strengths</p>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase mb-2">Weaknesses</p>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {report.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs font-bold text-yellow-500 uppercase mb-1">Expert Advice</p>
                    <p className="text-sm italic text-slate-300">{report.advice}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-8">
              <button onClick={() => setView('hub')} className="btn-primary">
                Return to Hub
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
