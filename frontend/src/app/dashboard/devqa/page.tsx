'use client';

import Link from "next/link";
import { useState } from 'react';

export default function Ask() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setAnswer('');
    setCopied(false);
    try {
      const res = await fetch('http://localhost:8000/ask-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Claude API error');
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setError((e as Error).message || 'Unknown error');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-[#1e293b]/90 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#fff] font-extrabold tracking-tight">SeniorDev AI</span>
          <span className="text-base text-[#fff]/60 font-mono tracking-widest hidden sm:inline">| Ask Anything</span>
        </div>
        <nav>
          <Link href="/dashboard" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Dashboard</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-12">
        <section className="flex-1 bg-[#fff]/20 rounded-2xl shadow-xl border border-[#fff]/30 p-8 flex flex-col justify-center items-start max-w-xl">
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-4">Ask Anything</h1>
          <p className="text-lg text-[#1e293b]/80 mb-6">
            Stuck on a bug? Need best practices? <span className="font-bold text-[#2a5298]">SeniorDev AI</span> is here to help. Ask any coding or devops question below.
          </p>
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-[#2a5298] p-4 text-base font-mono bg-[#fff]/80 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a5298] transition"
            placeholder="Type your question here..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <button
            className="bg-[#2a5298] hover:bg-[#fff] text-[#fff] hover:text-[#2a5298] font-bold px-8 py-3 rounded-lg shadow transition border border-[#2a5298] hover:scale-105"
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#f4acb7" strokeWidth="4" fill="none" /><path className="opacity-75" fill="#f4acb7" d="M4 12a8 8 0 018-8v8z" /></svg>
                Thinking…
              </span>
            ) : (
              <>
                <span className="animate-wiggle">🚀</span> Ask
              </>
            )}
          </button>
        </section>
        <aside className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-[#2a5298]/90 rounded-2xl shadow-lg p-8 w-full max-w-md text-center border-b-4 border-[#fff]">
            <span className="text-5xl mb-4 block">💬</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">AI-Powered Q&A</h2>
            <p className="text-[#fff]/80 mb-2">Get instant, accurate answers to your toughest coding questions.</p>
            <p className="text-[#fff]/60 text-sm">No question is too big or small!</p>
          </div>
        </aside>
      </main>
    </div>
  );
}