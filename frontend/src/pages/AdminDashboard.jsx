import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Layers, 
  Users, 
  Activity, 
  Cpu, 
  Lock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { apiService } from '../services/api';

const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await apiService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-cyber-textMuted h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyber-accent border-t-transparent mb-3" />
        <span className="font-mono text-xs">Decrypting Analytics Stream...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-cyber-danger" />
            <span>Cyber Threat Intelligence Console</span>
          </h1>
          <p className="text-cyber-textMuted text-sm mt-1">
            Global scan statistics, machine learning classification logs, and Indic language demographics.
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-cyber-danger/10 border border-cyber-danger/30 rounded text-cyber-danger text-[10px] font-mono uppercase tracking-widest h-fit">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span>Security Admin Access</span>
        </div>
      </div>

      {/* Cyber stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cumulative Scans', value: analytics.total_scans, desc: 'Processed by local nodes', icon: Layers, color: 'text-cyber-accent' },
          { label: 'Scams Isolated', value: analytics.threats_prevented, desc: 'Critical threat prevention', icon: ShieldAlert, color: 'text-cyber-danger' },
          { label: 'Average Risk Score', value: `${analytics.detection_rate}%`, desc: 'Average threat confidence', icon: Cpu, color: 'text-cyber-warning' },
          { label: 'Secure Core Nodes', value: '05 / 05', desc: 'Indicator services online', icon: Lock, color: 'text-cyber-success' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-cyber-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block">{stat.label}</span>
                <h3 className="text-2xl font-bold text-white mt-1 font-mono">{stat.value}</h3>
                <span className="text-[9px] text-cyber-textMuted block mt-0.5">{stat.desc}</span>
              </div>
              <div className={`p-2 bg-slate-900 rounded-lg border border-cyber-border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Threat timeline scan load (8 Cols) */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-xl border border-cyber-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Scan Activity & Threat Isolation Load</h3>
            <span className="text-[10px] font-mono text-cyber-accent">Past 7 Operational Days</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.activity_analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scansColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="threatsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
                <YAxis stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#38bdf8" fillOpacity={1} fill="url(#scansColor)" name="Total Scans" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#threatsColor)" name="Scams Isolated" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Breakdown Pie (4 Cols) */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-xl border border-cyber-border flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Indic Language Demographics</h3>
            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.language_statistics}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.language_statistics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121824', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center flex flex-col items-center justify-center font-mono">
                <span className="text-xs text-cyber-textMuted uppercase tracking-widest">Dialects</span>
                <span className="text-base font-bold text-white mt-0.5">{analytics.language_statistics.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-cyber-border/40 pt-4 mt-2">
            {analytics.language_statistics.map((lang, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300 font-medium">{lang.name}</span>
                </div>
                <span className="font-mono text-cyber-textMuted">{lang.value} scans</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Most Common scam types */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scam reasons bar chart (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-cyber-border">
          <h3 className="text-sm font-bold text-white mb-4">Distribution of Isolated Scam Signatures</h3>
          
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.scam_types_breakdown} layout="vertical" margin={{ top: 5, right: 10, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} fontClassName="font-mono" />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#white', fontSize: '10px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {analytics.scam_types_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time system log feeds (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-cyber-border flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-cyber-accent animate-pulse" />
              <span>Core Threat-Agent Process Log</span>
            </h3>
            
            <div className="space-y-2.5 max-h-48 overflow-y-auto font-mono text-[9px] text-slate-400 bg-black/45 border border-cyber-border/80 p-3 rounded-lg leading-normal">
              <div>[06:12:44] ANTISCAM_DAEMON: Booting Core Heuristics... OK</div>
              <div>[06:12:45] ML_PIPELINE: Loading DistilBERT transformer models...</div>
              <div>[06:12:46] ML_PIPELINE: Model initialized. Device context: CPU</div>
              <div>[06:13:01] DB_MANAGER: SQLite database connection confirmed.</div>
              <div>[06:14:15] TRANSLATOR: Multilingual translation pipeline online.</div>
              <div>[06:18:22] INTERFACE: Admin requested audit session token.</div>
              <div className="text-cyber-accent">[06:24:50] SCAM_ENGINE: Scam isolated from Message Scanner. Threat: DANGEROUS</div>
              <div className="text-cyber-accent">[06:25:01] SPEECH_ENGINE: Call transcribed successfully via Whisper AI.</div>
            </div>
          </div>

          <div className="border-t border-cyber-border/40 pt-3 mt-4 text-center">
            <span className="text-[10px] text-cyber-textMuted font-mono">
              Process ID: PID_8034 • Memory: 142MB / 512MB
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
