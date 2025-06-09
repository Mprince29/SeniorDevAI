'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import ModuleCard from './components/ModuleCard';

export default function Dashboard() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/modules')
      .then(res => res.json())
      .then(data => setModules(data));
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] flex flex-col items-center justify-between py-0 relative overflow-hidden">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-[#1e293b]/90 shadow-md z-20">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-[#fff] font-extrabold tracking-tight">SeniorDev AI</span>
          <span className="text-base text-[#fff]/60 font-mono tracking-widest hidden sm:inline">| Dashboard</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Home</Link>
        </nav>
      </header>

      {/* Dashboard Features */}
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] mt-12 mb-8">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full max-w-6xl px-6">
          <Link href="/dashboard/refactor" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-10 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
            <span className="text-5xl mb-4">🛠️</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">Refactor Instantly</h2>
            <p className="text-[#fff]/80">Transform messy code into clean, efficient solutions with a single click.</p>
          </Link>
          <Link href="/screen-assist" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-10 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
            <span className="text-5xl mb-4">🤖</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">Screen Assist</h2>
            <p className="text-[#fff]/80">Let SeniorDev AI analyze your visible code and terminal for context-aware assistance.</p>
          </Link>
          <Link href="/dashboard/devqa" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-10 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
            <span className="text-5xl mb-4">💬</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">Ask Anything</h2>
            <p className="text-[#fff]/80">Get instant answers to your development questions, from debugging to best practices.</p>
          </Link>
          <Link href="/gitops" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-10 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
            <span className="text-5xl mb-4">🔄</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">GitOps</h2>
            <p className="text-[#fff]/80">Automate your repository workflows and manage your codebase efficiently with GitOps tools.</p>
          </Link>
        </div>
        <div className="flex gap-6 mt-12">
          <Link href="/">
            <button className="bg-[#fff] hover:bg-[#2a5298] text-[#2a5298] hover:text-[#fff] font-bold px-8 py-3 rounded-lg shadow transition text-lg border border-[#2a5298] hover:scale-105">Back to Home</button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center items-center py-5 mt-0 text-xs text-[#fff]/70 font-mono select-none z-10 bg-[#1e293b]/95">
        <span>
          &copy; {new Date().getFullYear()} Master Prince. All rights reserved. | SeniorDev AI by Master Prince. Contact: prince28.01.2002@gmail.com
        </span>
      </footer>
    </div>
  );
}