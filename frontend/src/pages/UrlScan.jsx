import React, { useState } from 'react';
import { 
  Link2, 
  ShieldCheck, 
  AlertCircle, 
  Globe, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { apiService } from '../services/api';
import ScanResultCard from '../components/ScanResultCard';

export default function UrlScan() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const templates = [
    { label: 'Bank Phishing', url: 'http://hdfc-bank-netbanking-verification.xyz/login' },
    { label: 'Brand Spoof', url: 'http://amazon-giftcard-offer.xyz/claim' },
    { label: 'URL Shortener', url: 'https://bit.ly/update-paytm-kyc' },
    { label: 'Safe URL', url: 'https://www.google.com' }
  ];

  const handleTemplateClick = (inputUrl) => {
    setUrl(inputUrl);
    setResult(null);
    setError(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic URL validation
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'http://' + formattedUrl;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const steps = [
      'Extracting domain components...',
      'Checking domain DNS reputation heuristics...',
      'Analyzing spoofing / brand impersonation patterns...',
      'Verifying HTTPS certificate protocols...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, i === 3 ? 500 : 400));
    }

    try {
      const scanData = await apiService.analyzeUrl(formattedUrl);
      setResult(scanData);
    } catch (err) {
      console.error(err);
      setError('An error occurred during link reputation scanning. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Link2 className="w-8 h-8 text-cyber-accent" />
          <span>URL Scam & Phishing Detector</span>
        </h1>
        <p className="text-cyber-textMuted text-sm mt-1">
          Analyze web links for bank spoofing, suspicious top-level domains, URL redirectors, and insecure protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 rounded-xl border border-cyber-border">
            <form onSubmit={handleScan} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-cyber-textMuted uppercase tracking-wider mb-2">
                  Enter web link to verify
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. secure-login-bank.com/update"
                    className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-11 pr-4 py-3 text-sm focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650 text-white font-mono"
                  />
                </div>
              </div>

              {/* Templates */}
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-2">
                  Pre-configured Links (Click to load)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTemplateClick(tmpl.url)}
                      className={`px-3 py-2 rounded border text-xs font-mono truncate text-left transition-all hover:bg-slate-800/30
                        ${tmpl.label.includes('Safe') 
                          ? 'border-cyber-success/30 text-emerald-400 bg-cyber-success/5' 
                          : 'border-cyber-danger/30 text-rose-400 bg-cyber-danger/5'}`}
                    >
                      <span className="font-sans font-semibold block text-[10px] uppercase text-cyber-textMuted mb-0.5">
                        {tmpl.label}
                      </span>
                      {tmpl.url}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full bg-cyber-accent hover:bg-cyber-accent/80 disabled:bg-slate-850 disabled:border-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed font-bold text-cyber-bg py-3 px-4 rounded-lg shadow-cyber-glow flex items-center justify-center space-x-2 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyber-bg border-t-transparent" />
                      <span className="font-mono text-xs">{loadingStep}</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Analyze URL Legitimacy</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg text-cyber-danger flex items-start space-x-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Card (5 Cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="space-y-4">
              {/* Protocol status header */}
              <div className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs
                ${result.url.startsWith('https://') 
                  ? 'bg-cyber-success/5 border-cyber-success/30 text-cyber-success' 
                  : 'bg-cyber-warning/5 border-cyber-warning/30 text-cyber-warning'}`}
              >
                <div className="flex items-center space-x-2">
                  {result.url.startsWith('https://') ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <span>SSL Protocol: {result.url.startsWith('https://') ? 'HTTPS (SECURE)' : 'HTTP (INSECURE)'}</span>
                </div>
                <span>Port 80/443</span>
              </div>
              <ScanResultCard result={result} onReset={() => { setUrl(''); setResult(null); }} />
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-xl border border-cyber-border/40 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-cyber-card rounded-full border border-cyber-border mb-4">
                <Globe className="w-8 h-8 text-cyber-textMuted" />
              </div>
              <h3 className="text-sm font-semibold text-white">Awaiting URL Link</h3>
              <p className="text-xs text-cyber-textMuted max-w-xs mt-1.5 leading-relaxed">
                Paste the suspicious link in the input form on the left. The system will dissect the domain structures and alert you of threats.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
