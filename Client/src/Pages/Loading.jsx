import React, { useEffect, useState } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(8);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    "Waking the neural nets",
    "Loading knowledge base",
    "Optimizing responses",
    "Securing connections",
    "Almost ready",
  ];

  useEffect(() => {
    // Simulate progress
    const p = setInterval(() => {
      setProgress((v) => {
        if (v >= 96) return v; // stop near completion to wait for real event
        const next = v + Math.random() * 6; // random-ish increment
        return Math.min(96, Math.round(next));
      });
    }, 400);

    // Cycle status messages
    const ph = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, 1400);

    return () => {
      clearInterval(p);
      clearInterval(ph);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-[#020203] text-white">
      <div className="max-w-3xl w-full px-6 py-10 sm:py-14 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/6 shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 3v18M21 12H3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              QuickGPT — powering imagination
            </h1>
          </div>

          <div className="w-full">
            <p className="text-sm text-white/70 text-center mb-4">
              {phases[phaseIndex]}
            </p>

            <div className="flex items-center gap-4">
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3"
              >
                <svg
                  className="animate-spin -ml-1 mr-2 h-6 w-6 text-white/90"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>

              <div className="flex-1">
                <div className="w-full h-3 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>{progress}%</span>
                  <span>Preparing your AI experience…</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
            <svg
              className="w-4 h-4 text-white/80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
            <span>Secure • Private • Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
