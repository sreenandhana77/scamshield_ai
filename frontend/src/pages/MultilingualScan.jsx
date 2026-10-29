import React, { useState } from 'react';
import { 
  Languages, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import ScanResultCard from '../components/ScanResultCard';

export default function MultilingualScan() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [translationData, setTranslationData] = useState(null);
  const [error, setError] = useState(null);

  const langTemplates = [
    { 
      lang: 'Hindi', 
      label: 'Hindi Scam (Lottery)', 
      text: 'बधाई हो! आपका मोबाइल नंबर 25 लाख रुपये की लॉटरी पुरस्कार जीता है। अपना पुरस्कार दावा करने के लिए तुरंत http://kbc-reward-winner.xyz पर जाएं।' 
    },
    { 
      lang: 'Tamil', 
      label: 'Tamil Scam (KYC Block)', 
      text: 'அவசரம்: உங்கள் வங்கி கணக்கு தற்காலிகமாக முடக்கப்பட்டுள்ளது. உடனே உங்கள் கேஒய்சி விவரங்களை புதுப்பிக்க இந்த லிங்க்கை கிளிக் செய்யவும்: http://bank-kyc-verify.net।' 
    },
    { 
      lang: 'Telugu', 
      label: 'Telugu Scam (Bank Alert)', 
      text: 'హెచ్చరిక: మీ నెట్ బ్యాంకింగ్ పాస్‌వర్డ్ గడువు ముగిసింది. మీ ఖాతా బ్లాక్ కాకుండా ఉండటానికి వెంటనే http://secure-login-net.com లో లాగిన్ అవ్వండి.' 
    },
    { 
      lang: 'Malayalam', 
      label: 'Malayalam Scam (Gift Card)', 
      text: 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾക്ക് സൗജന്യ ആമസോൺ ഗിഫ്റ്റ് കാർഡ് ലഭിച്ചു. ഇത് ക്ലെയിം ചെയ്യാൻ ഈ ലിങ്ക് സന്ദർശിക്കുക.' 
    }
  ];

  const handleTemplateClick = (text) => {
    setMessage(text);
    setResult(null);
    setTranslationData(null);
    setError(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setTranslationData(null);

    const steps = [
      'Detecting message dialect patterns...',
      'Mapping language identifiers (ISO-639)...',
      'Invoking Translation Service (Translating to English)...',
      'Scanning translated content for scam features...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, i === 2 ? 1000 : 500));
    }

    try {
      // Step 1: Detect and translate
      const transResult = await apiService.translateText(message);
      setTranslationData(transResult);

      // Step 2: Run Scam analysis on the translated text (with detected language fed in)
      const scanData = await apiService.analyzeMessage(transResult.translated_text, transResult.detected_language);
      setResult(scanData);
    } catch (err) {
      console.error(err);
      setError('An error occurred during translation scan. Please check internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Languages className="w-8 h-8 text-cyber-accent" />
          <span>Multilingual Scam Detector</span>
        </h1>
        <p className="text-cyber-textMuted text-sm mt-1">
          Automatically detect Indic languages (Hindi, Tamil, Telugu, Malayalam) and translate them to scan central threat databases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Form and translation flow (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 rounded-xl border border-cyber-border">
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyber-textMuted uppercase tracking-wider mb-2">
                  Paste native script message here
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste Hindi, Tamil, Telugu, Malayalam, or English text..."
                  rows={6}
                  className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg p-4 text-sm focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-600 text-white font-sans"
                />
              </div>

              {/* Templates */}
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-2">
                  Select Regional Scam Examples
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {langTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTemplateClick(tmpl.text)}
                      className="p-2.5 rounded border border-cyber-border/80 bg-cyber-card/35 text-xs text-left transition-all hover:bg-slate-800/40"
                    >
                      <span className="font-mono font-bold block text-[10px] text-cyber-accent uppercase mb-0.5">
                        {tmpl.label}
                      </span>
                      <p className="text-slate-300 truncate">{tmpl.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full bg-cyber-accent hover:bg-cyber-accent/80 disabled:bg-slate-850 disabled:border-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed font-bold text-cyber-bg py-3 px-4 rounded-lg shadow-cyber-glow flex items-center justify-center space-x-2 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyber-bg border-t-transparent" />
                      <span className="font-mono text-xs">{loadingStep}</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Detect, Translate & Scan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {translationData && (
            <div className="glass-panel p-5 rounded-xl border border-cyber-border/80 bg-cyber-card/20 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-cyber-accent uppercase tracking-wider">
                  Language Processing Pipeline
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent">
                  Detected: {translationData.detected_language}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-1">Original Content</span>
                  <div className="p-3 bg-cyber-bg/70 border border-cyber-border/60 rounded-lg text-xs text-slate-300 leading-relaxed font-sans max-h-24 overflow-y-auto">
                    {message}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-1">English Translation</span>
                  <div className="p-3 bg-cyber-accent/5 border border-cyber-accent/20 rounded-lg text-xs text-cyan-200 leading-relaxed font-sans max-h-24 overflow-y-auto">
                    {translationData.translated_text}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg text-cyber-danger flex items-start space-x-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Side: Results Card (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <ScanResultCard result={result} onReset={() => { setMessage(''); setResult(null); setTranslationData(null); }} />
          ) : (
            <div className="glass-panel p-8 rounded-xl border border-cyber-border/40 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-cyber-card rounded-full border border-cyber-border mb-4">
                <Languages className="w-8 h-8 text-cyber-textMuted" />
              </div>
              <h3 className="text-sm font-semibold text-white">Awaiting Native Content</h3>
              <p className="text-xs text-cyber-textMuted max-w-xs mt-1.5 leading-relaxed">
                Paste regional text and watch the automated pipeline detect languages, translate them instantly, and isolate potential scam targets.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
