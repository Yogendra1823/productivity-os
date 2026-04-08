import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, CheckCircle, Clock, FileText, Activity } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState({ tasks: [], notes: [], schedule: [] });
  
  const API_URL = 'https://prod-os-backend-921753975716.asia-south1.run.app'; 

  const refreshState = async () => {
    const res = await axios.get(`${API_URL}/state`);
    setDb(res.data);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setLoading(true);
    setInput('');

    try {
      const res = await axios.post(`${API_URL}/query`, { user_input: input });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
      await refreshState(); // Update the dashboard cards
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', text: 'Backend unreachable.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      
      {/* Sidebar: Agent Memory */}
      <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', padding: '20px', background: '#fff' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18}/> Agent Registry</h3>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}><CheckCircle size={14}/> Tasks ({db.tasks.length})</div>
            {db.tasks.slice(-2).map((t, i) => <div key={i} style={{ fontSize: '12px', padding: '5px', borderBottom: '1px solid #f1f5f9' }}>{t}</div>)}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}><Clock size={14}/> Schedule ({db.schedule.length})</div>
            {db.schedule.slice(-2).map((s, i) => <div key={i} style={{ fontSize: '12px', padding: '5px', borderBottom: '1px solid #f1f5f9' }}>{s}</div>)}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}><FileText size={14}/> Notes ({db.notes.length})</div>
            {db.notes.slice(-2).map((n, i) => <div key={i} style={{ fontSize: '12px', padding: '5px', borderBottom: '1px solid #f1f5f9' }}>{n}</div>)}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px' }}>
        <h2 style={{ margin: '0 0 20px 0' }}>Productivity OS <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>v1.0 (Gemini 1.5 Flash)</span></h2>
        
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '15px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{ 
                display: 'inline-block', padding: '12px 18px', borderRadius: '12px',
                background: msg.role === 'user' ? '#0f172a' : '#f1f5f9',
                color: msg.role === 'user' ? '#fff' : '#0f172a',
                maxWidth: '80%'
              }}>{msg.text}</div>
            </div>
          ))}
          {loading && <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Orchestrator invoking agents...</div>}
        </div>

        {/* Input */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a command for the agents..."
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
          <button onClick={handleSend} style={{ background: '#0f172a', border: 'none', borderRadius: '8px', padding: '0 20px', color: '#fff', cursor: 'pointer' }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}