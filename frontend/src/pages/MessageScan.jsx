import React, { useState } from 'react';
import { 
  MessageSquare, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { apiService } from '../services/api';
import ScanResultCard from '../components/ScanResultCard';

export default function MessageScan() {
  const [activeTab, setActiveTab] = useState('sms');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const templates = {
    sms: [
      { label: 'Bank Scam', text: 'URGENT: Your SBI account has been locked due to suspicious login. Update your KYC details at http://sbi-verification-login.net within 24 hours to prevent permanent suspension.' },
      { label: 'Prize Spam', text: 'CONGRATULATIONS! Your mobile number has won a cash lottery reward of 5,00,000 INR from KBC. Send your Aadhaar and Google Pay details to claim immediately!' },
      { label: 'Normal SMS', text: 'Dear customer, your order has been dispatched. Track it online at the official store. Thanks for shopping with us.' }
    ],
    whatsapp: [
      { label: 'OTP Fraud', text: 'Hello, I am a support representative from WhatsApp. We sent a 6-digit confirmation code to your phone to update security. Please reply with the code to verify your profile.' },
      { label: 'Job Scam', text: 'Part-time Online Jobs! Earn 5000 to 10000 INR daily. Work from home just 1 hour a day. No experience needed. Click https://wa.me/job-agency-hr to join!' },
      { label: 'Normal chat', text: 'Hi! Can you share the contact details of the electrician who worked at your house last week? Need to call him.' }
    ],
    email: [
      { label: 'Card Phishing', text: 'Dear Netflix Subscriber, we were unable to process your monthly membership payment. Please update your credit card details immediately by visiting the secure portal: http://netflix-secure-billing.net/login. Failure to update will lead to account cancellation.' },
      { label: 'Inheritance Scam', text: 'Greetings, I am a legal consultant representing the estate of a deceased client. You are named as the beneficiary of a 1.2 Million USD inheritance. Please contact me urgently to process the release forms.' },
      { label: 'Normal Email', text: 'Hi Team, please find attached the project timeline and milestone definitions for the upcoming Anti Scam Assistant release. Let me know your thoughts by Friday.' }
    ]
  };

  const handleTemplateClick = (text) => {
    setMessage(text);
    setResult(null);
    setError(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate multi-step analysis stages for rich aesthetics
    const steps = [
      'Initializing Secure Neural Node...',
      'Performing Language Detection...',
      'Running Explainable Heuristics Engine...',
      'Evaluating Threat Indicators via DistilBERT...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, i === 3 ? 600 : 450));
    }

    try {
      const scanData = await apiService.analyzeMessage(message);
      setResult(scanData);
    } catch (err) {
      console.error(err);
      setError('An error occurred during threat scanning. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <MessageSquare className="w-8 h-8 text-cyber-accent" />
          <span>Message Scam Detector</span>
        </h1>
        <p className="text-cyber-textMuted text-sm mt-1">
          Scan SMS, WhatsApp, and Emails for phishing hooks, bank impersonation, and fraudulent requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Input Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Tab Selector */}
          <div className="glass-panel p-2 rounded-xl border border-cyber-border flex space-x-2">
            {[
              { id: 'sms', label: 'SMS Texts', icon: Smartphone },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'email', label: 'Email Content', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMessage('');
                    setResult(null);
                    setError(null);
                  }}
                  className={`flex items-center justify-center space-x-2 flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-cyber-accent text-cyber-bg shadow-cyber-glow font-bold' 
                      : 'text-cyber-textMuted hover:bg-slate-800/35 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="glass-panel p-5 rounded-xl border border-cyber-border">
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyber-textMuted uppercase tracking-wider mb-2">
                  Paste content below to analyze
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTab === 'sms' 
                      ? "Enter suspicious SMS content..." 
                      : activeTab === 'whatsapp' 
                        ? "Enter WhatsApp chat copy..." 
                        : "Enter full email subject and body..."
                  }
                  rows={6}
                  className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg p-4 text-sm focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-600 text-white font-sans"
                />
              </div>

              {/* Template shortcuts */}
              <div>
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block mb-2">
                  Quick Templates (Click to fill)
                </span>
                <div className="flex flex-wrap gap-2">
                  {templates[activeTab].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTemplateClick(tmpl.text)}
                      className={`px-3 py-1.5 rounded border text-xs font-medium transition-all
                        ${tmpl.label.includes('Normal') 
                          ? 'border-cyber-success/30 hover:bg-cyber-success/15 text-emerald-400 bg-cyber-success/5' 
                          : 'border-cyber-danger/30 hover:bg-cyber-danger/15 text-rose-400 bg-cyber-danger/5'}`}
                    >
                      {tmpl.label}
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
                      <ShieldCheck className="w-5 h-5" />
                      <span>Execute Scam Detection</span>
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

        {/* Right Side: Results Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {result ? (
            <ScanResultCard result={result} onReset={() => { setMessage(''); setResult(null); }} />
          ) : (
            <div className="glass-panel p-8 rounded-xl border border-cyber-border/40 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-cyber-card rounded-full border border-cyber-border mb-4">
                <FileText className="w-8 h-8 text-cyber-textMuted" />
              </div>
              <h3 className="text-sm font-semibold text-white">Awaiting Analysis</h3>
              <p className="text-xs text-cyber-textMuted max-w-xs mt-1.5 leading-relaxed">
                Paste message content on the left pane and launch the engine. AI analysis results will render here instantly.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
