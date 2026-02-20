import { useState } from "react";

export default function BiometricReportScreen() {
  const [report] = useState<null>(null);

  return (
    <div className="biometric-report bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-300 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-black">
      <div className="w-full h-8 bg-primary text-background-dark flex items-center justify-center text-xs font-bold tracking-[0.2em] uppercase">
        <span className="material-icons text-sm mr-2">lock</span>
        Classified // Bio-Intel Level 4 Access Required
      </div>

      <main className="flex-grow p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full relative">
        {report === null && (
          <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-primary/80">No data available.</div>
        )}
        <div className="bg-white dark:bg-black/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden relative min-h-[1000px]">
          <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />

          <header className="relative z-10 p-6 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/50 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-gray-200 dark:bg-gray-800 border border-primary/30 relative overflow-hidden flex items-center justify-center">
                <img
                  alt="Profile photo of Subject B"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZZ-7IP5s6xxz3FAYG2-C3fhqSNsZWXdk59iHiV-twAbnLcNBTV_6IEldnOzeP4_-HQ3tu2FwkuvI3zCFL9Di8wNZpFtPs9iPTi_cEwPXA_EKViaXnCiKbejlxG4ToNSpXnujwvH8sJB-FvrTDM34lAoFcai-F093QNbkkWyeOY7Zb3Z7nePHfNNnVaqR6WBtnpwJL0ln5VTXhTy-ieguUlEYVX2EN-ygIVL5oQfOx9ggCW_uLL9tuOU67K_pR-QiQMKzFLaBPS1BH"
                />
                <div className="absolute inset-0 border-2 border-primary/20" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider uppercase mb-1">
                  Behavioral Signal Report: Subject B
                </h1>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-primary">
                  <span className="border border-primary/30 px-2 py-0.5 rounded bg-primary/10">
                    ID: 882-X-B
                  </span>
                  <span className="flex items-center gap-1 opacity-80">
                    <span className="material-icons text-[10px]">schedule</span>
                    SESSION: 2023-10-27_T14:00
                  </span>
                  <span className="flex items-center gap-1 opacity-80">
                    <span className="material-icons text-[10px]">dns</span>
                    REQ-ID: #9942
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                Confidence Score
              </div>
              <div className="text-3xl font-bold text-primary">94.2%</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Signal Threshold Exceeded
              </div>
            </div>
          </header>

          <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <section className="bg-white dark:bg-[#2a261a]/50 border border-gray-200 dark:border-white/5 rounded p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-300 dark:border-white/10 pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons text-primary text-base">
                      timeline
                    </span>
                    Movement &amp; Tension Timeline
                  </h2>
                  <div className="flex gap-4 text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Movement Index
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Baseline
                    </span>
                  </div>
                </div>
                <div className="h-64 w-full relative flex items-end justify-between px-2 gap-1 mb-4">
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                    viewBox="0 0 800 200"
                  >
                    <line
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                      x1="0"
                      x2="800"
                      y1="50"
                      y2="50"
                    />
                    <line
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                      x1="0"
                      x2="800"
                      y1="100"
                      y2="100"
                    />
                    <line
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                      x1="0"
                      x2="800"
                      y1="150"
                      y2="150"
                    />
                    <polyline
                      fill="none"
                      opacity="0.5"
                      points="0,150 100,148 200,152 300,149 400,150 500,148 600,151 700,150 800,149"
                      stroke="#6b7280"
                      strokeDasharray="4"
                      strokeWidth="1.5"
                    />
                    <polyline
                      fill="none"
                      points="0,140 50,135 100,130 150,145 200,100 250,90 300,110 350,60 400,40 450,55 500,90 550,110 600,120 650,130 700,135 750,138 800,140"
                      stroke="#ec5b13"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,140 L50,135 L100,130 L150,145 L200,100 L250,90 L300,110 L350,60 L400,40 L450,55 L500,90 L550,110 L600,120 L650,130 L700,135 L750,138 L800,140 V200 H0 Z"
                      fill="url(#gradientPrimary)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient
                        id="gradientPrimary"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ec5b13" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ec5b13" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line
                      opacity="0.5"
                      stroke="#ec5b13"
                      strokeDasharray="2"
                      strokeWidth="1"
                      x1="400"
                      x2="400"
                      y1="0"
                      y2="200"
                    />
                    <circle cx="400" cy="40" fill="#ec5b13" r="4" />
                  </svg>
                  <div className="absolute top-[20%] left-[50%] -translate-x-1/2 bg-background-dark border border-primary text-primary px-3 py-1 rounded text-xs shadow-lg z-20">
                    <span className="font-bold">04:12</span>
                    <span className="text-white ml-2">Spike: Gesture intensity</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono border-l-2 border-primary pl-3">
                  <strong className="text-primary">ANALYSIS:</strong> Significant
                  deviation from baseline detected at 04:12. Gesture intensity
                  and shoulder tension spiked during Question block 3.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white dark:bg-[#2a261a]/50 border border-gray-200 dark:border-white/5 rounded p-5 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons text-primary text-base">
                        graphic_eq
                      </span>
                      Voice Stress &amp; Prosody
                    </h2>
                  </div>
                  <div className="flex-grow grid grid-cols-6 gap-1 mb-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`heat-${index}`}
                        className={`rounded h-8 transition-colors ${
                          index === 3 || index === 8 || index === 11
                            ? "bg-primary shadow-[0_0_10px_rgba(236,91,19,0.4)]"
                            : index % 3 === 0
                              ? "bg-primary/40"
                              : "bg-primary/10"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mb-2">
                    <span>LOW STRESS</span>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary/10 to-primary rounded" />
                    <span>CRITICAL</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Peaks in sentences 4, 9, &amp; 12 indicate pitch shifts
                    &gt;12% and elevated vocal jitter.
                  </p>
                </section>

                <section className="bg-white dark:bg-[#2a261a]/50 border border-gray-200 dark:border-white/5 rounded p-5 flex flex-col h-full relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="material-icons text-primary text-base">
                        face_retouching_natural
                      </span>
                      Micro-Expressions
                    </h2>
                  </div>
                  <div className="relative flex-grow min-h-[120px] bg-black/20 rounded border border-white/5 p-2 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-between px-2 text-[8px] text-gray-600 font-mono pointer-events-none z-0">
                      <span>00:00</span>
                      <span>00:30</span>
                      <span>01:00</span>
                    </div>
                    <div className="relative z-10 mt-4 space-y-3">
                      {[
                        { label: "EYES", segments: [30, 70] },
                        { label: "MOUTH", segments: [40] },
                        { label: "HEAD", segments: [20, 68] },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center group">
                          <div className="w-16 text-[9px] text-gray-400 font-mono text-right mr-2">
                            {row.label}
                          </div>
                          <div className="flex-grow h-1.5 bg-gray-700/30 rounded-full relative">
                            {row.segments.map((start) => (
                              <div
                                key={`${row.label}-${start}`}
                                className={`absolute h-full rounded-full ${
                                  start > 60
                                    ? "bg-primary"
                                    : start > 30
                                      ? "bg-primary/60"
                                      : "bg-primary/30"
                                }`}
                                style={{ left: `${start}%`, width: "10%" }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-0 left-[70%] h-full w-[1px] bg-red-500/50 z-20" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                    <span className="bg-background-dark/50 px-2 py-1 rounded border border-white/5">
                      Lip Compression
                    </span>
                    <span className="bg-background-dark/50 px-2 py-1 rounded border border-primary/30 text-primary">
                      Blink Rate Spike
                    </span>
                  </div>
                </section>
              </div>

              <div className="h-12 bg-black/40 rounded border border-white/5 flex items-center px-4 overflow-hidden relative">
                <div className="absolute left-2 text-[9px] text-primary/50 font-mono transform -rotate-90 origin-center">
                  AUDIO
                </div>
                <div className="flex items-center w-full justify-between h-8 gap-[1px] opacity-70">
                  {Array.from({ length: 60 }).map((_, index) => (
                    <div
                      key={`wave-${index}`}
                      className={`waveform-bar ${
                        index % 18 === 0 ? "bg-white/80" : ""
                      }`}
                      style={{ height: `${20 + (index % 7) * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <aside className="bg-gray-100 dark:bg-black/40 border-l border-gray-200 dark:border-white/10 p-5 lg:col-span-1 rounded-r-lg flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 pb-2 border-b border-gray-300 dark:border-white/10">
                Anomalies Log
              </h3>
              <ul className="space-y-4">
                <li className="bg-white dark:bg-[#2a261a]/80 p-3 rounded border border-primary/40 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse" />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-primary font-bold text-xs">[!] CRITICAL</span>
                    <span className="text-[10px] text-gray-500 font-mono">14:02:12</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Gesture Spike + Tension Burst
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                    Self-touch + shoulder tension rose sharply within 2.4s.
                  </p>
                </li>
                <li className="bg-white dark:bg-[#2a261a]/40 p-3 rounded border border-gray-200 dark:border-white/10 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-500" />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-500 font-bold text-xs">[WARN] VISUAL</span>
                    <span className="text-[10px] text-gray-500 font-mono">14:04:45</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Gaze Aversion + Blink Spike
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                    Gaze dropped with a 2x blink-rate increase.
                  </p>
                </li>
                <li className="bg-white dark:bg-[#2a261a]/40 p-3 rounded border border-gray-200 dark:border-white/10 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-500" />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-500 font-bold text-xs">[WARN] AUDIO</span>
                    <span className="text-[10px] text-gray-500 font-mono">14:05:01</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Pitch Shift +12%
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                    Prosody instability with elevated jitter and pitch variance.
                  </p>
                </li>
              </ul>
              <div className="mt-auto bg-primary/10 border border-primary/20 p-4 rounded text-xs">
                <h4 className="text-primary font-bold uppercase mb-2">
                  Automated Conclusion
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Subject exhibits <span className="text-primary">High Stress Probability</span>.
                  Behavioral markers align with known uncertainty indicators
                  during key questioning phases.
                </p>
              </div>
            </aside>
          </div>

          <footer className="bg-gray-100 dark:bg-black/60 border-t border-gray-200 dark:border-white/10 p-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-mono">
            <div>
              CONFIDENTIAL // EYES ONLY
              <span className="ml-4 opacity-50">HASH: 8f4a-22b1-cc09</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Generated by Bio-Intel Engine v4.2</span>
              <span className="text-primary border border-primary/30 px-2 py-0.5 rounded">
                PAGE 04 OF 12
              </span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
