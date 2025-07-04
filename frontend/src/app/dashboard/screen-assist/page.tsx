'use client';

import { useState, useRef, useEffect } from 'react';

function generateSessionId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2)
  );
}

export default function ScreenAssistPage() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [simple, setSimple] = useState('');
  const [framesDone, setFramesDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>(generateSessionId());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Start screen capture and automate scroll/frame sending
  const handleStartScreenAssist = () => {
    if (window.innerWidth < 768) {
      alert('Screen Assist works best on desktop.');
      return;
    }
    if (!query.trim()) {
      setError('Please describe your issue before starting screen sharing.');
      return;
    }
    setError('');
    setAnalysis('');
    setSimple('');
    setProgress(0);
    setRecording(false);
    setFramesDone(false);
    setCountdown(5);
    stopRef.current = false;
    startScreenCapture(); // Start screen sharing immediately
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setCountdown(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Only call getDisplayMedia after user selects screen, then start timer
  const startScreenCapture = async () => {
    setRecording(true);
    try {
      // Prompt user to select screen (browser will always show dialog)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' }
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      // After screen is selected, start countdown for user to bring code to front
      setCountdown(5);
      let countdownVal = 5;
      const timer = setInterval(() => {
        countdownVal -= 1;
        setCountdown(countdownVal);
        if (countdownVal <= 0) {
          clearInterval(timer);
          setCountdown(0);
          captureMultipleFrames();
        }
      }, 1000);
    } catch (e: any) {
      if (e && e.name === 'NotAllowedError') {
        setError('Screen sharing was denied. Please allow screen sharing and try again.');
      } else if (e && e.name === 'NotFoundError') {
        setError('No screen or window was found to share. Please try again.');
      } else if (e && e.name === 'InvalidStateError') {
        setError('Screen sharing is not available in this browser mode (e.g., Incognito). Please use a normal window.');
      } else {
        setError(e.message || 'Screen capture failed.');
      }
      setRecording(false);
    }
  };

  // Capture 5 frames at 2s intervals, then send all to backend
  const captureMultipleFrames = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setFramesDone(false);
    let frames: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (!videoRef.current || !canvasRef.current) break;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/png');
      frames.push(base64);
      setProgress(i + 1);
      await new Promise(res => setTimeout(res, 2000));
    }
    // Stop screen sharing
    videoRef.current.srcObject && (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    setRecording(false);
    // Send all frames to backend for analysis
    try {
      const finalRes = await fetch('http://localhost:8000/screen-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64_list: frames,
          query,
          session_id: sessionIdRef.current,
          is_final: true
        })
      });
      const contentType = finalRes.headers.get('content-type');
      if (!finalRes.ok || !contentType || !contentType.includes('application/json')) {
        const text = await finalRes.text();
        setLoading(false);
        setError('Screen Assist backend error: ' + finalRes.status);
        return;
      }
      const finalData = await finalRes.json();
      setLoading(false);
      if (finalData.error) {
        setError(finalData.error);
        setAnalysis('');
        setSimple('');
      } else {
        setAnalysis(finalData.analysis || 'No analysis.');
        setSimple(finalData.simple || '');
        setTimeout(() => {
          if (outputRef.current) outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      setLoading(false);
      setError('Failed to analyze screen. Please try again.');
    }
  };

  const handleCaptureAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setFramesDone(false);
    setError('');
    setAnalysis('');
    setSimple('');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/png');
    // Stop screen sharing
    video.srcObject && (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    setRecording(false);
    try {
      const finalRes = await fetch('http://localhost:8000/screen-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          query,
          session_id: sessionIdRef.current,
          is_final: true
        })
      });
      // Defensive: check if response is JSON
      const contentType = finalRes.headers.get('content-type');
      if (!finalRes.ok || !contentType || !contentType.includes('application/json')) {
        const text = await finalRes.text();
        console.error('Screen Assist: Non-JSON or error response', text);
        setLoading(false);
        setError('Screen Assist backend error: ' + finalRes.status);
        return;
      }
      const finalData = await finalRes.json();
      console.log('Screen Assist: Final data', finalData);
      setLoading(false);
      if (finalData.error) {
        setError(finalData.error);
        setAnalysis('');
        setSimple('');
      } else {
        setAnalysis(finalData.analysis || 'No analysis.');
        setSimple(finalData.simple || '');
        setTimeout(() => {
          if (outputRef.current) outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      setLoading(false);
      setError('Failed to analyze screen. Please try again.');
      // Debug: log the error
      console.error('Screen Assist: Error in handleCaptureAnalyze', e);
    }
  };

  const handleStop = () => {
    stopRef.current = true;
    setRecording(false);
    setLoading(true);
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleReset = () => {
    setQuery('');
    setAnalysis('');
    setSimple('');
    setError('');
    setCopied(false);
    setFramesDone(false);
    setProgress(0);
    setRecording(false);
    setLoading(false);
    // Stop any ongoing screen capture
    stopRef.current = true;
    videoRef.current?.pause();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopRef.current = true;
      videoRef.current?.pause();
      videoRef.current?.srcObject &&
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] flex flex-col items-center justify-center py-12">
      <div className="max-w-7xl w-full p-0 bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] rounded-2xl shadow-2xl border border-[#1e3c72] animate-fade-in flex flex-row gap-0 overflow-hidden">
        {/* Left: Query Input and Controls */}
        <div className="w-1/3 flex flex-col gap-6 p-10 bg-[#2a5298]/80 border-r border-[#1e3c72] min-h-[600px] justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-4 text-[#fff] tracking-tight flex items-center gap-2">
              <span className="animate-bounce">🪟</span> Screen Assist
            </h1>
            <p className="text-[#fff]/80 mb-6 text-sm">Capture your screen, scroll automatically, and let SeniorDev AI analyze everything you see.</p>
            <label className="block font-semibold mb-2 text-[#fff]/80">Describe what you’re stuck on <span className="text-[#fff]/60">(required)</span></label>
            <textarea
              className="w-full border border-[#fff]/40 rounded-lg p-3 bg-[#fff]/80 text-[#1e3c72] font-mono text-base transition min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#2a5298] placeholder:text-[#2a5298]/60 mb-2"
              rows={4}
              placeholder="Describe what's on your screen or the problem you're facing..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={recording}
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-5 py-2 bg-gradient-to-r from-[#2a5298] to-[#1e3c72] text-[#fff] font-bold rounded-lg shadow-lg hover:from-[#fff] hover:to-[#2a5298] hover:text-[#2a5298] transition disabled:opacity-60 flex items-center gap-2"
                onClick={handleStartScreenAssist}
                disabled={recording || countdown > 0 || !query.trim()}
              >
                <span className="animate-wiggle">🎥</span> {recording ? 'Recording...' : 'Start Screen Assist'}
              </button>
              <button
                className="px-4 py-2 bg-[#fff]/80 text-[#2a5298] rounded border border-[#2a5298] text-xs hover:bg-[#2a5298] hover:text-[#fff] transition"
                onClick={handleReset}
                disabled={recording && !error && !analysis && !query}
              >
                <span>🔄</span> Reset
              </button>
            </div>
            {countdown > 0 && (
              <div className="mt-4 text-[#fff] text-base font-semibold animate-fade-in">
                Please switch to your code editor and make sure only your code is visible.<br />
                <b>Screen sharing will start automatically in {countdown} second{countdown !== 1 ? 's' : ''}...</b>
              </div>
            )}
            {recording && (
              <>
                <video ref={videoRef} className="hidden" autoPlay playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                <div className="text-[#fff]/80 text-sm mt-4">Capturing screen... <b>{progress}</b> frames sent</div>
                {framesDone && (
                  <div className="mt-2 text-[#fff]/80 text-xs font-semibold">Frame captured! If you have more code, scroll down and click <b>Capture & Analyze</b> again. When done, click <b>Capture & Analyze</b> to finish and analyze.</div>
                )}
                <button className="mt-4 px-4 py-1 bg-[#fff]/80 text-[#2a5298] rounded border border-[#2a5298]" onClick={handleCaptureAnalyze}>Capture & Analyze</button>
              </>
            )}
            {error && (
              <div className="mt-4 text-[#fff] bg-[#2a5298] border border-[#fff]/30 rounded-lg p-3 font-medium flex items-center gap-2 animate-shake">
                <span>❌</span> {error}
              </div>
            )}
            <div className="text-xs text-[#fff]/70 opacity-70 mt-8">
              <b>How it works:</b> SeniorDev AI scrolls your screen, captures frames, and analyzes all visible text/code. No images or videos are stored.
            </div>
            <div className="text-xs text-[#fff]/90 opacity-90 mt-2">
              ⚠️ For best results, please select <b>Entire Screen</b> to allow SeniorDev AI to see your code editor and terminal.
            </div>
            <div className="text-xs text-[#fff]/90 opacity-90 mt-2">
              Please scroll manually through your code — SeniorDev AI will extract visible text frame by frame.
            </div>
          </div>
        </div>
        {/* Right: Response area, now much wider */}
        <div className="w-2/3 flex flex-col justify-center items-center p-10 bg-gradient-to-br from-[#fff] via-[#e3ecfa] to-[#c7d6f7] min-h-[600px] h-full">
          {loading && (
            <div className="flex items-center gap-2 text-[#2a5298] text-base animate-fade-in">
              <span className="animate-spin inline-block text-xl">🧠</span> Analyzing captured text with Claude...
            </div>
          )}
          {simple && !loading && (
            <div
              ref={outputRef}
              className="w-full h-full bg-[#fff]/90 p-8 rounded-2xl border border-[#2a5298] shadow-lg animate-fade-in relative flex flex-col justify-start"
              style={{ minHeight: '300px', maxHeight: '100%', overflow: 'auto' }}
            >
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className="font-semibold text-[#2a5298] text-lg">AI Help</h2>
                <button
                  className={`px-4 py-1 text-xs font-semibold rounded transition flex items-center gap-1 ${copied ? 'bg-[#a7e7c7] text-[#232946]' : 'bg-[#2a5298] text-[#fff] hover:bg-[#fff] hover:text-[#2a5298]'}`}
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="animate-pulse">✅ Copied</span>
                  ) : (
                    <>
                      <span>📋</span> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="text-[#1e293b] text-base w-full" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{simple}</div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle { animation: wiggle 0.7s infinite; display: inline-block; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
    </div>
  );
}
