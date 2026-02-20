export default function SecureLinkSharingModalScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] font-display relative overflow-hidden p-6">
      <style>{`
        .glass-panel { background: rgba(16, 22, 34, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 30px 80px rgba(0,0,0,0.6); }
        .pulse-ring { box-shadow: 0 0 0 0 rgba(19, 91, 236, 0.4); animation: pulse 2.2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(19, 91, 236, 0.4); } 70% { box-shadow: 0 0 0 18px rgba(19, 91, 236, 0); } 100% { box-shadow: 0 0 0 0 rgba(19, 91, 236, 0); } }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(19,91,236,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(242,185,13,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl glass-panel rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/20 text-primary pulse-ring">
              <span className="material-symbols-outlined text-xl">encrypted</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-bold tracking-wide uppercase">Secure Link Sharing</h2>
              <p className="text-xs text-gray-400">Analysis Report ID: <span className="font-mono text-primary/80">#INT-8842-XF</span></p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Security Level</label>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">ENCRYPTED</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-1 bg-black/20 rounded-lg">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5">
                <span className="material-symbols-outlined text-lg">public</span>
                Standard
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium bg-primary text-white shadow-lg shadow-primary/20 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="material-symbols-outlined text-lg">lock</span>
                Restricted Access
              </button>
            </div>

            <div className="mt-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-lg">key</span>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/30 border border-white/10 text-sm font-mono tracking-wider text-white" defaultValue="intel-secure-882" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-semibold hover:text-white transition-colors">GENERATE</button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Secure Link</label>
            <div className="flex items-center gap-3">
              <input className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-sm font-mono text-white" defaultValue="https://secure.opm.ai/share/INT-8842-XF" />
              <button className="px-4 py-3 rounded-lg bg-primary text-white text-xs font-semibold uppercase tracking-wider">Copy</button>
            </div>
            <div className="text-xs text-gray-400">Link expires in 48 hours. Access is logged.</div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button className="px-6 py-3 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Send Secure Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
