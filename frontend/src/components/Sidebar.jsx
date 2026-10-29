import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  MessageSquare, 
  Link2, 
  Volume2, 
  Languages, 
  History, 
  ShieldAlert, 
  Terminal,
  LogOut
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, user, onLogout }) {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/message', name: 'Message Scanner', icon: MessageSquare },
    { path: '/url', name: 'URL Scanner', icon: Link2 },
    { path: '/voice', name: 'Voice Analyzer', icon: Volume2 },
    { path: '/multilingual', name: 'Multilingual', icon: Languages },
    { path: '/history', name: 'Scan History', icon: History },
    { path: '/admin', name: 'Threat Analytics', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 
        w-64 border-r border-cyber-border glass-panel
        flex flex-col justify-between transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div>
          <div className="p-6 border-b border-cyber-border flex items-center space-x-3">
            <div className="p-2 bg-cyber-accent/10 rounded-lg border border-cyber-accent/30 shadow-cyber-glow">
              <Shield className="w-6 h-6 text-cyber-accent animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyber-accent bg-clip-text text-transparent">
                ANTI SCAM ASSISTANT
              </h1>
              <p className="text-[10px] text-cyber-accent font-mono uppercase tracking-widest">
                Defense Core v1.0
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-cyber-accent/15 text-white border-l-2 border-cyber-accent shadow-cyber-glow' 
                      : 'text-cyber-textMuted hover:bg-slate-800/40 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Panel & Log Out */}
        <div className="p-4 border-t border-cyber-border bg-cyber-bg/40 space-y-3">
          {user && (
            <div className="flex items-center justify-between p-2.5 bg-cyber-card/75 rounded-lg border border-cyber-border/80">
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <img 
                  src={user.profile_pic || "https://lh3.googleusercontent.com/a/default-user=s96-c"} 
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-cyber-accent/30 flex-shrink-0"
                />
                <div className="min-w-0 font-sans">
                  <div className="text-xs font-bold text-white truncate capitalize">{user.username}</div>
                  <div className="text-[10px] text-cyber-textMuted truncate leading-none mt-0.5">{user.email}</div>
                </div>
              </div>
              
              <button 
                onClick={onLogout}
                className="p-1.5 bg-slate-900 border border-cyber-border hover:border-cyber-danger hover:bg-cyber-danger/10 text-cyber-textMuted hover:text-cyber-danger rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="p-2.5 bg-cyber-card/45 rounded-lg border border-cyber-border/60 flex items-center space-x-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-success"></span>
            </div>
            <span className="font-mono text-[9px] text-cyber-textMuted uppercase tracking-wider">
              SHIELD SECURE CONNECT
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
