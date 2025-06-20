'use client';

import { useState } from 'react';

const PROMPT_TEMPLATES = [
  "Explain this code in simple terms.",
  "What does this function do?",
  "Summarize the logic of the following code.",
  "Convert this code into TypeScript.",
];

export default function PromptExplorerPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(PROMPT_TEMPLATES[0]);
  const [prompt, setPrompt] = useState(PROMPT_TEMPLATES[0]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrompt(e.target.value);
    setPrompt(e.target.value);
  };

  const handleRunPrompt = async () => {
    setLoading(true);
    setResponse('');
    try {
      // Replace with your Claude endpoint as needed
      const res = await fetch('http://localhost:8000/claude-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: '', question: prompt }),
      });
      const data = await res.json();
      setResponse(data.answer || data.content || 'No answer received.');
    } catch (err) {
      setResponse('Error fetching response.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Prompt Explorer</h1>
      <div className="mb-4">
        <label className="block font-medium mb-1">Choose a prompt template</label>
        <select
          className="w-full border rounded p-2"
          value={selectedPrompt}
          onChange={handleTemplateChange}
        >
          {PROMPT_TEMPLATES.map((tpl, idx) => (
            <option key={idx} value={tpl}>
              {tpl}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Edit your prompt</label>
        <textarea
          className="w-full border rounded p-2"
          rows={4}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleRunPrompt}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Prompt'}
      </button>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Claude's Response:</h2>
        <pre className="bg-gray-100 border rounded p-4 min-h-[48px] whitespace-pre-wrap">
          {loading ? 'Loading...' : response}
        </pre>
      </div>
    </div>
  );
}