import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Smartphone, 
  Link2, 
  Volume2, 
  Eye, 
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../services/api';

export default function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterThreat, setFilterThreat] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await apiService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to purge all scam scan history from the device?")) {
      localStorage.removeItem('antiscam_history');
      setHistory([]);
      setSelectedScan(null);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return Smartphone;
      case 'url':
        return Link2;
      case 'voice':
        return Volume2;
      default:
        return Info;
    }
  };

  // Filtering Logic
  const filteredHistory = history.filter(scan => {
    const matchesSearch = scan.input.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || scan.type === filterType;
    const matchesThreat = filterThreat === 'all' || scan.threat_level === filterThreat;
    return matchesSearch && matchesType && matchesThreat;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <History className="w-8 h-8 text-cyber-accent" />
            <span>Audit & Scan History</span>
          </h1>
          <p className="text-cyber-textMuted text-sm mt-1">
            Browse through previous scam threat isolation logs recorded on this device node.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-cyber-danger/30 text-cyber-danger/80 hover:text-white hover:bg-cyber-danger hover:border-cyber-danger rounded-lg transition-all text-xs font-mono w-fit"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Audit Log</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border/80 bg-cyber-card/30 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-xs focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650 text-white font-sans"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-cyber-bg/75 border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-textMuted focus:border-cyber-accent focus:outline-none transition-all"
        >
          <option value="all">All Channels</option>
          <option value="message">Messages (SMS/WA/Email)</option>
          <option value="url">URLs & Links</option>
          <option value="voice">Voice Recordings</option>
        </select>

        {/* Threat Level Filter */}
        <select
          value={filterThreat}
          onChange={(e) => setFilterThreat(e.target.value)}
          className="bg-cyber-bg/75 border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-textMuted focus:border-cyber-accent focus:outline-none transition-all"
        >
          <option value="all">All Threat Levels</option>
          <option value="Safe">Safe</option>
          <option value="Suspicious">Suspicious</option>
          <option value="Dangerous">Dangerous</option>
        </select>

      </div>

      {/* History Table Grid */}
      <div className="glass-panel rounded-xl border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-cyber-textMuted">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyber-accent border-t-transparent mx-auto mb-3" />
            <span className="font-mono text-xs">Loading logs...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-10 text-center text-cyber-textMuted">
            <p className="text-sm font-semibold text-white">No Threat Logs Found</p>
            <p className="text-xs mt-1">Try modifying your filters or execute new scans.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cyber-border bg-slate-900/60 font-mono text-[10px] text-cyber-textMuted uppercase tracking-wider">
                  <th className="p-4">Type</th>
                  <th className="p-4">Input Content Snippet</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4">Threat Level</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 font-sans">
                {filteredHistory.map((scan) => {
                  const TypeIcon = getIcon(scan.type);
                  
                  let badgeColor = 'text-cyber-success bg-cyber-success/15 border-cyber-success/20';
                  if (scan.threat_level === 'Suspicious') badgeColor = 'text-cyber-warning bg-cyber-warning/15 border-cyber-warning/20';
                  if (scan.threat_level === 'Dangerous') badgeColor = 'text-cyber-danger bg-cyber-danger/15 border-cyber-danger/20';

                  return (
                    <tr 
                      key={scan.id}
                      onClick={() => setSelectedScan(scan)}
                      className="hover:bg-slate-800/20 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded bg-slate-900 border border-cyber-border text-cyber-accent">
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <span className="capitalize font-medium text-white">{scan.type}</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs sm:max-w-sm md:max-w-md truncate font-medium text-slate-300">
                        {scan.input}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {scan.risk_score}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] border ${badgeColor}`}>
                          {scan.threat_level}
                        </span>
                      </td>
                      <td className="p-4 text-cyber-textMuted font-mono">
                        {new Date(scan.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-4 text-center">
                        <button className="p-1 hover:text-cyber-accent text-slate-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Inspector Detail */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-xl border border-cyber-border/95 shadow-cyber-glow overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-cyber-border bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-cyber-accent" />
                <span className="font-mono text-xs text-cyber-accent uppercase tracking-wider font-bold">Threat Report Auditor</span>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-cyber-textMuted hover:text-white font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Threat badge */}
              <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Log ID</span>
                  <span className="font-mono text-xs text-white">{selectedScan.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Threat Level</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border
                    ${selectedScan.threat_level === 'Safe' ? 'text-cyber-success bg-cyber-success/10 border-cyber-success/30' : ''}
                    ${selectedScan.threat_level === 'Suspicious' ? 'text-cyber-warning bg-cyber-warning/10 border-cyber-warning/30' : ''}
                    ${selectedScan.threat_level === 'Dangerous' ? 'text-cyber-danger bg-cyber-danger/10 border-cyber-danger/30' : ''}
                  `}>
                    {selectedScan.threat_level.toUpperCase()} ({selectedScan.risk_score}/100)
                  </span>
                </div>
              </div>

              {/* Input details */}
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-1">Scan Content Input</span>
                <div className="p-3 bg-cyber-bg border border-cyber-border rounded-lg text-xs leading-normal font-sans break-words text-slate-200">
                  {selectedScan.input}
                </div>
              </div>

              {/* Reasons */}
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-1.5 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-cyber-accent" />
                  <span>Indicators Detected</span>
                </span>
                <ul className="space-y-1.5">
                  {selectedScan.reasons && selectedScan.reasons.map((reason, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center space-x-2 font-medium">
                      <span className={`w-1 h-1 rounded-full ${selectedScan.risk_score > 30 ? 'bg-cyber-danger' : 'bg-cyber-success'}`} />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-cyber-textMuted pt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Captured: {new Date(selectedScan.timestamp).toLocaleString()}</span>
                {selectedScan.language && selectedScan.language !== 'N/A' && (
                  <>
                    <span>•</span>
                    <span>Language: {selectedScan.language}</span>
                  </>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-3 bg-cyber-card border-t border-cyber-border text-center">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-6 py-2 bg-cyber-accent text-cyber-bg font-bold text-xs rounded hover:bg-cyber-accent/80 transition-colors"
              >
                Close Report Auditor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
