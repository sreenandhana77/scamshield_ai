import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function ScanResultCard({ result, onReset }) {
  if (!result) return null;

  const { risk_score, threat_level, scam_probability, detected_reasons, recommendations } = result;

  // Determine colors and icons based on threat level
  let theme = {
    color: 'text-cyber-success',
    bg: 'bg-cyber-success/10',
    border: 'border-cyber-success/30 border-glow-success',
    badgeBg: 'bg-cyber-success/20 text-cyber-success border border-cyber-success/40',
    glow: 'shadow-success-glow',
    icon: ShieldCheck,
    label: 'Safe',
    desc: 'No major scam elements detected. Keep being cautious.'
  };

  if (threat_level === 'Suspicious') {
    theme = {
      color: 'text-cyber-warning',
      bg: 'bg-cyber-warning/10',
      border: 'border-cyber-warning/30 border-glow-warning',
      badgeBg: 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/40',
      glow: 'shadow-warning-glow',
      icon: AlertTriangle,
      label: 'Suspicious',
      desc: 'Potential scam elements identified. Proceed with high caution.'
    };
  } else if (threat_level === 'Dangerous') {
    theme = {
      color: 'text-cyber-danger',
      bg: 'bg-cyber-danger/10',
      border: 'border-cyber-danger/30 border-glow-danger',
      badgeBg: 'bg-cyber-danger/20 text-cyber-danger border border-cyber-danger/40',
      glow: 'shadow-danger-glow',
      icon: ShieldAlert,
      label: 'Dangerous',
      desc: 'High-risk scam threat detected. Immediate action recommended!'
    };
  }

  const Icon = theme.icon;

  // Radial progress calculations
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (risk_score / 100) * circumference;

  return (
    <div className={`glass-panel p-6 rounded-xl border ${theme.border} ${theme.glow} transition-all duration-500 animate-[fadeIn_0.4s_ease-out]`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cyber-border gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${theme.bg}`}>
            <Icon className={`w-8 h-8 ${theme.color}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-cyber-textMuted text-xs font-mono uppercase tracking-wider">Analysis Result</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${theme.badgeBg}`}>
                {theme.label.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">Threat Level: {theme.label}</h2>
          </div>
        </div>
        
        {onReset && (
          <button 
            onClick={onReset}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-accent hover:bg-cyber-accent/10 text-cyber-textMuted hover:text-white transition-all text-xs font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        )}
      </div>

      {/* Main Grid: Score vs Explainable Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
        
        {/* Risk Score Circle Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-r border-cyber-border/40">
          <div className="relative flex items-center justify-center w-36 h-36">
            
            {/* SVG Ring Gauge */}
            <svg className="w-full h-full transform -rotate-95">
              <circle
                className="text-slate-800"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
              />
              <circle
                className={`transition-all duration-1000 ease-out ${theme.color}`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
              />
            </svg>
            
            {/* Score Numbers Inside */}
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-extrabold text-white">{risk_score}</span>
              <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest mt-0.5">Risk Score</span>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <span className="text-xs font-mono text-cyber-textMuted">
              Confidence: {Math.round(scam_probability * 100)}%
            </span>
          </div>
        </div>

        {/* Explainable AI Reasons */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono text-cyber-accent uppercase tracking-widest mb-3 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Detection Reasons (Explainable AI)</span>
            </h3>
            <ul className="space-y-2.5">
              {detected_reasons.map((reason, idx) => (
                <li 
                  key={idx}
                  className="flex items-start space-x-2.5 text-sm font-medium text-slate-300"
                >
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${risk_score > 30 ? 'bg-cyber-danger' : 'bg-cyber-success'}`} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-3 rounded bg-slate-900/40 border border-cyber-border/40">
            <p className="text-xs text-cyber-textMuted leading-relaxed">
              <strong>Risk Context:</strong> {theme.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Safety Actions & Recommendations */}
      <div className="border-t border-cyber-border/40 pt-6 mt-2">
        <h3 className="text-xs font-mono text-cyber-accent uppercase tracking-widest mb-4">
          Recommended Safety Guidelines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-3 bg-cyber-card/65 rounded-lg border border-cyber-border flex items-start space-x-3 hover:border-cyber-accent/30 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-slate-300 leading-normal">{rec}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
