'use client';

import Link from "next/link";

export default function GitOps() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-[#1e293b]/90 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#fff] font-extrabold tracking-tight">SeniorDev AI</span>
          <span className="text-base text-[#fff]/60 font-mono tracking-widest hidden sm:inline">| GitOps</span>
        </div>
        <nav>
          <Link href="/dashboard" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Dashboard</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-12">
        <section className="flex-1 bg-[#fff]/20 rounded-2xl shadow-xl border border-[#fff]/30 p-8 flex flex-col justify-center items-start max-w-xl">
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-4">GitOps Automation</h1>
          <p className="text-lg text-[#1e293b]/80 mb-6">
            Automate your repository workflows, manage PRs, and keep your codebase in sync with <span className="font-bold text-[#2a5298]">SeniorDev AI</span>.
          </p>
          <input
            className="w-full rounded-lg border border-[#2a5298] p-4 text-base font-mono bg-[#fff]/80 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a5298] transition"
            placeholder="Paste your repo URL here..."
          />
          <button className="bg-[#2a5298] hover:bg-[#fff] text-[#fff] hover:text-[#2a5298] font-bold px-8 py-3 rounded-lg shadow transition border border-[#2a5298] hover:scale-105">
            Analyze Repo
          </button>
        </section>
        <aside className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-[#2a5298]/90 rounded-2xl shadow-lg p-8 w-full max-w-md text-center border-b-4 border-[#fff]">
            <span className="text-5xl mb-4 block">🔄</span>
            <h2 className="text-2xl font-bold text-[#fff] mb-2">Why GitOps?</h2>
            <p className="text-[#fff]/80 mb-2">Automate, audit, and accelerate your development lifecycle with modern GitOps tools.</p>
            <p className="text-[#fff]/60 text-sm">Supports GitHub, GitLab, Bitbucket, and more.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}