import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, ShieldCheck, Terminal, ShieldAlert } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MessageScan from './pages/MessageScan';
import UrlScan from './pages/UrlScan';
import VoiceScan from './pages/VoiceScan';
import MultilingualScan from './pages/MultilingualScan';
import ScanHistory from './pages/ScanHistory';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('antiscam_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('antiscam_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('antiscam_user');
    setUser(null);
  };

  // Auth Protection Gate
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-cyber-bg text-cyber-text flex">
        
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} user={user} onLogout={handleLogout} />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0">
          
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cyber-border glass-panel px-4 md:px-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 -ml-2 rounded-lg text-cyber-textMuted hover:bg-slate-800/40 hover:text-white md:hidden"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyber-accent animate-pulse hidden md:block" />
                <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                  Anti Scam Assistant Platform Node
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Security Shield Indicator Badge */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-accent/10 border border-cyber-accent/30 rounded-lg text-cyber-accent font-mono text-[10px] tracking-wider uppercase">
                <Terminal className="w-3.5 h-3.5" />
                <span>SHELL CONNECTED</span>
              </div>
            </div>
          </header>

          {/* Page Body Viewport with Cyber Grid Overlay */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-y-auto cyber-grid">
            
            {/* Gradient backdrop decoration to make the UI look premium */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-accent/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyber-danger/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/message" element={<MessageScan />} />
                <Route path="/url" element={<UrlScan />} />
                <Route path="/voice" element={<VoiceScan />} />
                <Route path="/multilingual" element={<MultilingualScan />} />
                <Route path="/history" element={<ScanHistory />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </main>

        </div>
      </div>
    </Router>
  );
}
