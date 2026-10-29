import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Upload, 
  Play, 
  Pause, 
  AlertCircle, 
  FileAudio, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';
import ScanResultCard from '../components/ScanResultCard';

export default function VoiceScan() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  
  // Custom mock audio files for easy testing
  const mockAudioSamples = [
    { name: 'sbi_bank_block_alert.mp3', label: 'Bank Urgent Alert Call' },
    { name: 'kbc_lucky_draw_prize.wav', label: 'Prize Winning Lottery Call' },
    { name: 'regular_meeting_update.wav', label: 'Safe Conversation' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('audio/wav') || droppedFile.type.includes('audio/mpeg') || droppedFile.type.includes('audio/mp3') || droppedFile.name.endsWith('.wav') || droppedFile.name.endsWith('.mp3'))) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    } else {
      setError('Please upload a valid .wav or .mp3 audio file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSampleClick = (sample) => {
    // Create a mock file object to represent the sample
    const mockFile = new File(["mockContent"], sample.name, { type: 'audio/mp3' });
    setFile(mockFile);
    setResult(null);
    setError(null);
  };

  const handleScan = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const steps = [
      'Reading audio stream vectors...',
      'Feeding vectors into Whisper AI Speech-To-Text pipeline...',
      'Transcribing conversation phrases...',
      'Analyzing transcript via AI Scam Engine...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, i === 1 ? 1200 : 700));
    }

    try {
      const scanData = await apiService.analyzeVoice(file);
      setResult(scanData);
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred during audio classification. Please verify format.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated visualizer bars
  const [visualizerBars, setVisualizerBars] = useState(Array(24).fill(10));
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerBars(Array(24).fill(0).map(() => Math.floor(Math.random() * 45) + 5));
      }, 120);
    } else {
      setVisualizerBars(Array(24).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Volume2 className="w-8 h-8 text-cyber-accent" />
          <span>Voice Scam Call Analyzer</span>
        </h1>
        <p className="text-cyber-textMuted text-sm mt-1">
          Upload recorded voice calls in .wav or .mp3 to run speech-to-text transcription and extract threat metrics.
        </p>
      </div>

      {/* Voice Processing Pipeline Banner */}
      <div className="glass-panel p-4 rounded-xl border border-cyber-border/80 bg-cyber-card/40 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-cyber-textMuted uppercase tracking-wider">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-slate-800 text-white">1</span>
          <span>Audio Call Upload</span>
        </div>
        <div className="text-cyber-accent">&rarr;</div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-slate-800 text-white">2</span>
          <span>Whisper Speech-To-Text</span>
        </div>
        <div className="text-cyber-accent">&rarr;</div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-slate-800 text-white">3</span>
          <span>Semantic Scam Check</span>
        </div>
        <div className="text-cyber-accent">&rarr;</div>
        <div className="flex items-center space-x-2 text-cyber-accent font-bold">
          <span className="p-1 rounded bg-cyber-accent/15 border border-cyber-accent/30">4</span>
          <span>Final Threat Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Upload & Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* File Dropzone */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="glass-panel p-6 rounded-xl border border-dashed border-cyber-border hover:border-cyber-accent/60 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px]"
          >
            <input
              type="file"
              id="voice-file-input"
              accept=".wav,.mp3"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="voice-file-input" className="cursor-pointer flex flex-col items-center justify-center">
              <div className="p-4 bg-cyber-card rounded-full border border-cyber-border mb-3 hover:scale-105 transition-transform">
                <Upload className="w-7 h-7 text-cyber-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white">Drag & drop Call Recording here</h3>
              <p className="text-xs text-cyber-textMuted mt-1">Supports .wav, .mp3 formats (max 10MB)</p>
            </label>

            {file && (
              <div className="mt-4 p-2.5 bg-cyber-card rounded-lg border border-cyber-border flex items-center space-x-3 text-xs w-full max-w-sm justify-between">
                <div className="flex items-center space-x-2 text-white font-mono truncate">
                  <FileAudio className="w-4 h-4 text-cyber-accent flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <button 
                  onClick={() => { setFile(null); setResult(null); setIsPlaying(false); }}
                  className="text-cyber-danger hover:underline text-[10px] uppercase font-bold"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Preset Audio Simulator */}
          <div className="glass-panel p-5 rounded-xl border border-cyber-border">
            <h2 className="text-xs font-mono text-cyber-textMuted uppercase tracking-wider mb-3">
              Test with Simulated Audio Streams
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockAudioSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample)}
                  className={`p-3 rounded-lg border text-xs text-left transition-all hover:bg-slate-800/30 flex flex-col justify-between h-20
                    ${file && file.name === sample.name 
                      ? 'border-cyber-accent bg-cyber-accent/5' 
                      : 'border-cyber-border bg-cyber-card/40'}`}
                >
                  <span className="font-semibold text-white block mb-1 truncate">{sample.label}</span>
                  <span className="font-mono text-[9px] text-cyber-textMuted truncate">{sample.name}</span>
                </button>
              ))}
            </div>

            {file && (
              <div className="pt-4 border-t border-cyber-border/40 mt-4">
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full bg-cyber-accent hover:bg-cyber-accent/80 font-bold text-cyber-bg py-3 px-4 rounded-lg shadow-cyber-glow flex items-center justify-center space-x-2 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyber-bg border-t-transparent" />
                      <span className="font-mono text-xs">{loadingStep}</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Transcribe & Scan Call</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg text-cyber-danger flex items-start space-x-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Side: Results & Audio Visualizer / Transcript (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {result ? (
            <div className="space-y-5">
              
              {/* Transcription Visualizer Card */}
              <div className="glass-panel p-5 rounded-xl border border-cyber-border">
                
                {/* Audio Wave Visualizer */}
                <div className="flex items-center space-x-3 pb-4 border-b border-cyber-border">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-cyber-accent/15 border border-cyber-accent/30 rounded-full text-cyber-accent hover:bg-cyber-accent/35 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  {/* Glowing Equalizer Bars */}
                  <div className="flex items-end justify-between flex-1 h-10 px-2">
                    {visualizerBars.map((barHeight, idx) => (
                      <div 
                        key={idx}
                        className={`w-1 bg-cyber-accent rounded-full transition-all duration-100`}
                        style={{ height: `${barHeight}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcript read-out */}
                <div className="mt-4">
                  <h3 className="text-xs font-mono text-cyber-accent uppercase tracking-widest mb-2 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Whisper Transcription</span>
                  </h3>
                  <div className="p-3 bg-cyber-bg/80 border border-cyber-border/70 rounded-lg text-xs leading-relaxed max-h-[120px] overflow-y-auto font-sans text-slate-300">
                    "{result.transcript}"
                  </div>
                </div>
              </div>

              <ScanResultCard result={result} onReset={() => { setFile(null); setResult(null); setIsPlaying(false); }} />
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-xl border border-cyber-border/40 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-cyber-card rounded-full border border-cyber-border mb-4">
                <Volume2 className="w-8 h-8 text-cyber-textMuted" />
              </div>
              <h3 className="text-sm font-semibold text-white">Awaiting Voice Call</h3>
              <p className="text-xs text-cyber-textMuted max-w-xs mt-1.5 leading-relaxed">
                Provide an audio file or select a preset call scenario, then trigger the Whisper engine to inspect voice conversations.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
