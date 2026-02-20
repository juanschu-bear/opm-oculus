export default function IntelligenceReportExportScreen() {
  return (
    <div className="min-h-screen bg-[#221e10] text-slate-200 font-display relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(242, 185, 13, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(242, 185, 13, 0.3); border-radius: 4px; }
      `}</style>

      <header className="w-full h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#221e10]/90 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold">
              <span className="material-icons text-xl">radar</span>
            </div>
            <span className="text-lg tracking-widest font-bold text-white uppercase">
              Oculus<span className="text-primary">Intel</span>
            </span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <nav className="flex items-center text-sm tracking-wide space-x-2 text-slate-400">
            <span className="hover:text-primary cursor-pointer transition-colors">ARCHIVE</span>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="hover:text-primary cursor-pointer transition-colors">SESSION 4829-AX</span>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-primary font-medium">EXPORT PREVIEW</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-xs leading-tight">
            <span className="text-slate-400">OPERATOR</span>
            <span className="font-bold text-primary">CMDR. V. REYNOLDS</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-primary/30 p-0.5 bg-black/20">
            <img
              alt="Operator"
              className="w-full h-full object-cover rounded-full grayscale opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKLNv9hJGGcUVmHlZIouaIEeIiWTeDp0PJUWLDIn65k8a12krG4OuBBlz7j3FOM3WEqn04o3YidQaxkAarMnWxhlSAG9S_r-mPzb1y5MFyZTGgQf9lsURud7Rx2BqvSZ-vmOa5llheY4anUQQwllRkqZaMUKvnlRLFyEmVvbyRTx5Q4rC7PVHYrC8D9a-HI9V2aMkw_u5EXLa5a4sl4YmNk2SYHfEcC28gMT7eZm2_f4uGttVnfHFN6Sc4WFE-BTfoOlkVyjzK04cs"
            />
          </div>
        </div>
      </header>

      <main className="flex">
        <aside className="w-20 border-r border-white/5 bg-[#1a160c]/70 py-6 flex flex-col items-center gap-4 custom-scrollbar overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={`page-${index}`}
              className={`w-12 h-16 rounded-lg border ${
                index === 0 ? "border-primary" : "border-white/10"
              } bg-[#131008] flex items-center justify-center text-xs text-primary/80`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
          <button className="w-12 h-12 rounded-full border border-white/10 text-primary">+</button>
        </aside>

        <section className="flex-1 p-8 grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-[#f9f7f2] text-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d7d0c0_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">INTELLIGENCE DOSSIER.</h1>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mt-1">
                    Clearance Level 4 Only
                  </p>
                </div>
                <div className="w-16 h-16 border border-slate-300 flex items-center justify-center">
                  <div className="w-8 h-8 bg-slate-800"></div>
                </div>
              </div>

              <div className="mt-6 border border-slate-300 rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&auto=format&fit=crop"
                    alt="Scene"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded">REC</div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-yellow-500">lat: 40.7128° N / lon: 74.0060° W</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="uppercase tracking-widest text-slate-500">Session ID</div>
                  <div className="font-mono">4829-AX-WING</div>
                </div>
                <div>
                  <div className="uppercase tracking-widest text-slate-500">Date & Time</div>
                  <div className="font-mono">2023-10-27 14:32Z</div>
                </div>
                <div>
                  <div className="uppercase tracking-widest text-slate-500">Analyst</div>
                  <div className="font-mono">Cmdr. V. Reynolds</div>
                </div>
                <div>
                  <div className="uppercase tracking-widest text-slate-500">Risk Assessment</div>
                  <div className="font-mono text-red-600">CRITICAL / IMMINENT</div>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-600 leading-relaxed">
                Subject identified entering the secure perimeter at 14:00 hours. Behavioral analysis
                algorithms flagged anomalous movement patterns consistent with evasion tactics.
                Biometrics confirm identity with 99.8% accuracy.
              </div>
              <div className="mt-6 text-xs text-slate-400">PAGE 1 OF 14</div>
            </div>
          </div>

          <div className="bg-[#1a160c]/80 rounded-2xl border border-white/10 p-6 space-y-6">
            <div>
              <div className="text-sm font-semibold text-white">Export Config</div>
              <div className="text-xs text-slate-400">Customize data inclusion for download.</div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Executive Summary", sub: "Key findings & analysis" },
                { label: "Full Finding Log", sub: "Raw timestamped data" },
                { label: "Biometric Graphs", sub: "Heart rate & gaze tracking" },
                { label: "Subject Profiles", sub: "Requires L5 clearance" },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center justify-between border border-white/10 rounded-xl p-4 bg-black/20">
                  <div>
                    <div className="text-sm text-white">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
                  </div>
                  <div className={`w-12 h-6 rounded-full border border-primary/40 ${index < 3 ? "bg-primary" : "bg-black/40"}`}></div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary">Output Format</div>
              <div className="mt-3 border border-white/10 rounded-xl bg-black/20 px-4 py-3 text-sm">
                High-Fidelity PDF (Vector)
              </div>
            </div>

            <button className="w-full rounded-xl bg-primary text-black py-3 text-sm font-bold uppercase">
              Generate & Download
            </button>
            <div className="text-xs text-slate-500 text-center">Estimated size: ~24.5 MB · Encrypted (AES‑256)</div>
          </div>
        </section>
      </main>
    </div>
  );
}
