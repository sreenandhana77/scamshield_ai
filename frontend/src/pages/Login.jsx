import React, { useEffect, useState } from 'react';
import { Shield, Lock, Mail, User, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [activeMode, setActiveMode] = useState('login'); // 'login' or 'signup'
  
  // Local form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google credential verify callback
  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await apiService.loginGoogle(response.credential);
      setSuccess('Google Identity Decrypted. Session authenticated!');
      setTimeout(() => onLoginSuccess(user), 1000);
    } catch (err) {
      console.error(err);
      setError('Google Sign-In verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated Google login for sandbox presentations / dynamic domains
  const handleDemoGoogleLogin = () => {
    setLoading(true);
    setError(null);
    setSuccess('Initializing Sandbox Auth Key...');
    setTimeout(() => {
      onLoginSuccess({
        id: 999,
        username: "security_presenter",
        email: "presenter@antiscam.ai",
        role: "admin",
        profile_pic: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        google_id: "sandbox_presenter_google_101"
      });
    }, 800);
  };

  // Google Button initialization
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "688461747803-placeholderclientid.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "dark", 
            size: "large", 
            type: "standard", 
            shape: "pill",
            text: "signin_with", 
            width: "320" 
          }
        );
      } else {
        setTimeout(initializeGoogleSignIn, 500);
      }
    };
    initializeGoogleSignIn();
  }, [activeMode]); // Re-render when switching modes to rebind element reference

  // Handle local registration/login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (activeMode === 'signup') {
      // Validations
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all registration fields.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      try {
        const user = await apiService.registerLocal(username, email, password);
        setSuccess('Account created successfully! Switching to Login...');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setActiveMode('login');
          setSuccess(null);
        }, 1500);
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login validation
      if (!username.trim() || !password.trim()) {
        setError('Please enter your email/username and password.');
        setLoading(false);
        return;
      }

      try {
        const user = await apiService.loginLocal(username, password);
        setSuccess('Credentials authorized! Syncing session...');
        setTimeout(() => onLoginSuccess(user), 1000);
      } catch (err) {
        setError(err.message || 'Invalid username/email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden cyber-grid font-sans">
      {/* Decorative gradient glow bubbles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-danger/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Auth Main Card */}
      <div className="glass-panel-glow max-w-md w-full p-8 rounded-2xl border border-cyber-accent/20 shadow-cyber-glow relative z-10 space-y-6">
        
        {/* Shield logo & Branding */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-cyber-accent/10 rounded-full border border-cyber-accent/30 shadow-cyber-glow w-fit mx-auto animate-pulse">
            <Shield className="w-8 h-8 text-cyber-accent" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-cyber-accent bg-clip-text text-transparent uppercase">
              Anti Scam Assistant Platform
            </h1>
            <p className="text-[10px] text-cyber-textMuted font-mono mt-0.5 uppercase tracking-widest">
              Access Core Security Node
            </p>
          </div>
        </div>

        {/* Tab mode toggles */}
        <div className="grid grid-cols-2 bg-cyber-bg/70 border border-cyber-border rounded-lg p-1">
          <button
            onClick={() => { setActiveMode('login'); setError(null); setSuccess(null); }}
            className={`py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200
              ${activeMode === 'login' ? 'bg-cyber-accent text-cyber-bg font-extrabold shadow-cyber-glow' : 'text-cyber-textMuted hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveMode('signup'); setError(null); setSuccess(null); }}
            className={`py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200
              ${activeMode === 'signup' ? 'bg-cyber-accent text-cyber-bg font-extrabold shadow-cyber-glow' : 'text-cyber-textMuted hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="p-3 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg text-cyber-danger flex items-start space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-cyber-success/10 border border-cyber-success/30 rounded-lg text-cyber-success flex items-start space-x-2 text-xs">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign Up username/email inputs */}
          {activeMode === 'signup' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. cyber_analyst"
                    className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650"
                  />
                </div>
              </div>
            </>
          )}

          {/* Login username/email */}
          {activeMode === 'login' && (
            <div>
              <label className="block text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider mb-1">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email address..."
                  className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-10 py-2.5 text-xs text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {activeMode === 'signup' && (
            <div>
              <label className="block text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cyber-bg/75 border border-cyber-border rounded-lg pl-9 pr-10 py-2.5 text-xs text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent focus:outline-none transition-all placeholder:text-slate-650"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyber-accent hover:bg-cyber-accent/80 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed font-extrabold uppercase tracking-wider text-xs text-cyber-bg py-3 px-4 rounded-lg shadow-cyber-glow flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-cyber-bg border-t-transparent" />
                  <span>Authorizing Key...</span>
                </div>
              ) : (
                <span>{activeMode === 'login' ? 'Access Console' : 'Register Credentials'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Divider separator */}
        <div className="flex items-center justify-between py-2 text-cyber-textMuted text-[10px] font-mono uppercase">
          <span className="w-1/4 h-px bg-cyber-border" />
          <span>Or login using</span>
          <span className="w-1/4 h-px bg-cyber-border" />
        </div>

        {/* Google Authentication Container & Demo Link */}
        <div className="flex flex-col items-center w-full space-y-3">
          <div id="google-signin-btn" className="shadow-cyber-glow rounded-full overflow-hidden" />
          
          <button
            type="button"
            onClick={handleDemoGoogleLogin}
            className="w-full bg-slate-900 border border-cyber-accent/40 hover:border-cyber-accent hover:bg-cyber-accent/10 text-cyber-accent font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-wider transition-all shadow-cyber-glow"
          >
            <span>Presenter Mode: Bypass Google Error</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-cyber-border/40 text-[9px] font-mono text-cyber-textMuted uppercase tracking-widest">
          Secured via SHA-256 PBKDF2 & Google OAuth
        </div>

      </div>
    </div>
  );
}
