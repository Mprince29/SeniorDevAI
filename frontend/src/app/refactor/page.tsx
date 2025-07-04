'use client';

import { useState } from 'react';

export default function RefactorPage() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/refactor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: text }),
    });

    const data = await res.json();
    setOutput(data.refactored);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">🛠 Refactor Code</h1>
      <textarea
        className="mt-4 w-full border p-2"
        rows={10}
        placeholder="Paste your code here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit}
      >
        Refactor
      </button>
      {output && (
        <div className="mt-6 bg-gray-100 p-4 rounded border border-gray-300">
          <h2 className="font-semibold mb-2">🧠 Refactored Code:</h2>
          <pre className="bg-gray-800 text-green-200 p-3 rounded overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}