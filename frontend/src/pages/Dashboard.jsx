import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  ArrowUpRight,
  MessageSquare,
  Link2,
  Volume2,
  Languages,
  Activity
} from 'lucide-react';
import { apiService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_scans: 0,
    detection_rate: 0,
    threats_prevented: 0
  });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const analytics = await apiService.getAnalytics();
        const history = await apiService.getHistory();
        setStats({
          total_scans: analytics.total_scans,
          detection_rate: analytics.detection_rate,
          threats_prevented: analytics.threats_prevented
        });
        setRecentScans(history.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const quickScans = [
    { name: 'Message Scam Detection', desc: 'SMS, Email, WhatsApp content analyzer', icon: MessageSquare, path: '/message', color: 'text-cyber-accent', bg: 'bg-cyber-accent/10' },
    { name: 'URL Scam Detection', desc: 'Identify fake bank domains & shorteners', icon: Link2, path: '/url', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Voice Scam Detection', desc: 'Transcribe and scan wav/mp3 calls', icon: Volume2, path: '/voice', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Multilingual Scan', desc: 'Detect and translate regional languages', icon: Languages, path: '/multilingual', color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' }
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Security Command Dashboard</h1>
        <p className="text-cyber-textMuted text-sm mt-1">Real-time artificial intelligence anti-scam monitoring portal.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Total Scans */}
        <div className="glass-panel p-5 rounded-xl border border-cyber-border flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase tracking-wider">Total Scans Run</span>
            <h3 className="text-3xl font-bold text-white mt-1">
              {loading ? <span className="animate-pulse">...</span> : stats.total_scans}
            </h3>
            <span className="text-[10px] text-cyber-accent font-mono mt-1 flex items-center space-x-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Real-time data feeds</span>
            </span>
          </div>
          <div className="p-3 bg-cyber-accent/15 rounded-lg border border-cyber-accent/30 shadow-cyber-glow">
            <TrendingUp className="w-6 h-6 text-cyber-accent" />
          </div>
        </div>

        {/* Scam Detection Rate */}
        <div className="glass-panel p-5 rounded-xl border border-cyber-border flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase tracking-wider">Detection Accuracy</span>
            <h3 className="text-3xl font-bold text-white mt-1">
              {loading ? <span className="animate-pulse">...</span> : `${stats.detection_rate}%`}
            </h3>
            <span className="text-[10px] text-cyber-success font-mono mt-1 flex items-center">
              <span>BERT & Heuristics model</span>
            </span>
          </div>
          <div className="p-3 bg-cyber-success/15 rounded-lg border border-cyber-success/30 shadow-success-glow">
            <UserCheck className="w-6 h-6 text-cyber-success" />
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="glass-panel p-5 rounded-xl border border-cyber-border flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase tracking-wider">Threats Isolated</span>
            <h3 className="text-3xl font-bold text-cyber-danger mt-1">
              {loading ? <span className="animate-pulse">...</span> : stats.threats_prevented}
            </h3>
            <span className="text-[10px] text-cyber-danger font-mono mt-1 flex items-center">
              <span>Dangerous / Suspicious cases</span>
            </span>
          </div>
          <div className="p-3 bg-cyber-danger/15 rounded-lg border border-cyber-danger/30 shadow-danger-glow">
            <ShieldAlert className="w-6 h-6 text-cyber-danger" />
          </div>
        </div>

      </div>

      {/* Main Grid: Quick Scans vs Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Scans (Left 7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 rounded-xl border border-cyber-border">
            <h2 className="text-base font-bold text-white mb-4">Quick Analysis Launchpad</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickScans.map((scan, idx) => {
                const Icon = scan.icon;
                return (
                  <Link 
                    key={idx} 
                    to={scan.path}
                    className="p-4 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-accent/50 hover:bg-slate-800/20 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className={`p-2.5 rounded-lg ${scan.bg} w-fit ${scan.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-white mt-3 group-hover:text-cyber-accent transition-colors">
                        {scan.name}
                      </h3>
                      <p className="text-xs text-cyber-textMuted mt-1">
                        {scan.desc}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-cyber-accent mt-4 flex items-center space-x-1">
                      <span>Launch scanner</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Threat Feeds (Right 5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-xl border border-cyber-border flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Recent Security Logs</h2>
                <Link to="/history" className="text-xs font-mono text-cyber-accent hover:underline flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-2 py-4">
                    <div className="h-10 bg-slate-800/50 animate-pulse rounded" />
                    <div className="h-10 bg-slate-800/50 animate-pulse rounded" />
                    <div className="h-10 bg-slate-800/50 animate-pulse rounded" />
                  </div>
                ) : recentScans.length === 0 ? (
                  <p className="text-xs text-cyber-textMuted py-4 text-center">No recent scans logged.</p>
                ) : (
                  recentScans.map((scan) => {
                    let threatBadge = 'bg-cyber-success/10 text-cyber-success border border-cyber-success/20';
                    if (scan.threat_level === 'Suspicious') threatBadge = 'bg-cyber-warning/10 text-cyber-warning border border-cyber-warning/20';
                    if (scan.threat_level === 'Dangerous') threatBadge = 'bg-cyber-danger/10 text-cyber-danger border border-cyber-danger/20';

                    return (
                      <div 
                        key={scan.id}
                        className="p-3 bg-cyber-card/60 rounded-lg border border-cyber-border/70 flex items-center justify-between text-xs transition-colors hover:border-cyber-border/90"
                      >
                        <div className="space-y-1 pr-3 truncate">
                          <p className="text-white font-medium truncate">{scan.input}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-cyber-textMuted font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="uppercase">{scan.type}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${threatBadge}`}>
                          {scan.threat_level}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-cyber-border/40 mt-4 text-center">
              <span className="text-[10px] font-mono text-cyber-textMuted">
                Active Scanner Node Protocol: ISO-IEC 27001 Certified heuristics
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
