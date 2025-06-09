'use client';

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#fff] flex flex-col items-center justify-between py-0 relative overflow-hidden">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-[#1e293b]/90 shadow-md z-20">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-[#fff] font-extrabold tracking-tight">SeniorDev AI</span>
          <span className="text-base text-[#fff]/60 font-mono tracking-widest hidden sm:inline">| Empower Your Code</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/dashboard/refactor" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Refactor</Link>
          <Link href="/dashboard/devqa" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Ask</Link>
          <Link href="/gitops" className="text-[#fff] hover:text-[#2a5298] font-bold transition">GitOps</Link>
          <Link href="/screen-assist" className="text-[#fff] hover:text-[#2a5298] font-bold transition">Screen Assist</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 w-full max-w-5xl px-6 py-16 mt-8 bg-[#fff]/20 rounded-2xl shadow-xl border border-[#fff]/30">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] leading-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-[#fff] via-[#fff] to-[#2a5298] bg-clip-text text-transparent">Meet Your Senior Developer</span>
            <br />
            <span className="text-[#2a5298]">AI Assistant</span>
          </h1>
          <p className="text-lg text-[#1e293b]/80 max-w-lg">
            <span className="font-bold text-[#2a5298]">SeniorDev AI</span> helps you refactor, debug, document, and automate your codebase. Get instant answers, screen-aware help, and more—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/dashboard/refactor">
              <button className="bg-[#2a5298] hover:bg-[#fff] text-[#fff] hover:text-[#2a5298] font-bold px-7 py-3 rounded-lg shadow transition text-base border border-[#2a5298] hover:scale-105">Try Refactor</button>
            </Link>
            <Link href="/dashboard/devqa">
              <button className="bg-[#fff] hover:bg-[#2a5298] text-[#2a5298] hover:text-[#fff] font-bold px-7 py-3 rounded-lg shadow transition text-base border border-[#2a5298] hover:scale-105">Ask Anything</button>
            </Link>
      
            <Link href="/screen-assist">
              <button className="bg-[#fff] hover:bg-[#2a5298] text-[#2a5298] hover:text-[#fff] font-bold px-7 py-3 rounded-lg shadow transition text-base border border-[#2a5298] hover:scale-105">Screen Assist</button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {isClient && (
            <Image
              src="/image.png"
              alt="SeniorDev AI Illustration"
              width={400}
              height={400}
              className="rounded-xl shadow-2xl border-4 border-[#2a5298]/30 bg-[#fff]/40 object-contain transition hover:scale-105"
              priority
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 mb-8">
        <Link href="/dashboard/refactor" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-7 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
          <span className="text-4xl mb-3">🛠️</span>
          <h2 className="text-xl font-bold text-[#fff] mb-1">Refactor Instantly</h2>
          <p className="text-[#fff]/80">Transform messy code into clean, efficient solutions with a single click.</p>
        </Link>
        <Link href="/screen-assist" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-7 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
          <span className="text-4xl mb-3">🤖</span>
          <h2 className="text-xl font-bold text-[#fff] mb-1">Screen Assist</h2>
          <p className="text-[#fff]/80">Let SeniorDev AI analyze your visible code and terminal for context-aware assistance.</p>
        </Link>
        <Link href="/dashboard/devqa" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-7 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
          <span className="text-4xl mb-3">💬</span>
          <h2 className="text-xl font-bold text-[#fff] mb-1">Ask Anything</h2>
          <p className="text-[#fff]/80">Get instant answers to your development questions, from debugging to best practices.</p>
        </Link>
        <Link href="/gitops" className="bg-[#2a5298]/90 rounded-xl shadow-lg p-7 flex flex-col items-center text-center border-b-4 border-[#fff] hover:scale-105 transition cursor-pointer">
          <span className="text-4xl mb-3">🔄</span>
          <h2 className="text-xl font-bold text-[#fff] mb-1">GitOps</h2>
          <p className="text-[#fff]/80">Automate your repository workflows and manage your codebase efficiently with GitOps tools.</p>
        </Link>
      </section>

      {/* Call to Action */}
      <section className="w-full flex flex-col items-center justify-center py-10 bg-gradient-to-r from-[#2a5298]/80 to-[#fff]/80">
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] mb-3">Ready to boost your productivity?</h3>
        <p className="text-base text-[#1e293b]/80 mb-5"> Start using SeniorDev AI for free!</p>
        <Link href="/dashboard">
          <button className="bg-[#1e293b] hover:bg-[#fff] text-[#fff] hover:text-[#1e293b] font-bold px-8 py-3 rounded-lg shadow transition text-lg border border-[#fff] hover:scale-105">Go to Dashboard</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full flex justify-center items-center py-5 mt-0 text-xs text-[#fff]/70 font-mono select-none z-10 bg-[#1e293b]/95">
        <span>
          &copy; {new Date().getFullYear()} Master Prince. All rights reserved. | SeniorDev AI by Master Prince. Contact: prince28.01.2002@gmail.com
        </span>
      </footer>
    </div>
  );
}
