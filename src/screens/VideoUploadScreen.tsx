import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";

export default function VideoUploadScreen() {
  const { startAnalyze, status, error, lastUploadName } = useSession();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("School");

  const presets = [
    { value: "School", label: "🏫 School — Quick engagement scan" },
    { value: "Therapy", label: "🧠 Therapy — Deep session analysis" },
    { value: "Coaching", label: "🎯 Coaching — Performance feedback" },
    { value: "Sales", label: "💼 Sales — Conversation analysis" },
    { value: "Investigation", label: "🔍 Investigation — Maximum depth" },
  ];

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    const jobId = await startAnalyze(file, selectedPreset);
    setIsUploading(false);
    if (jobId) {
      navigate("/processing");
    }
  };

  const handleBrowse = () => fileInputRef.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="noise-overlay" />

      <div className="ambient-glow top-[-10%] left-[-10%]" />
      <div
        className="ambient-glow bottom-[-10%] right-[-10%]"
        style={{
          background:
            "radial-gradient(circle, rgba(15, 23, 42, 0.4) 0%, rgba(10, 10, 12, 0) 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 glass-panel border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold">
                visibility
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Perception AI
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              className="text-sm font-medium text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-sm font-medium text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Recent Analyses
            </a>
            <a
              className="text-sm font-medium text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Documentation
            </a>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">
                notifications
              </span>
            </button>
            <div className="h-7 sm:h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Pro Account
                </p>
              </div>
              <img
                alt="User Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-JsByGrkQRW_IIOwnQsabIzmtNeEl2I5hDeYw72QILq3R3hd5h_voFgkbBDpBRky6OMVL-_dapDEyoaq9PEsADAOVwUuKIJDEYFOnNzJxclNfpXpXq5F0sS6XzOiPErPGchqZHm9EvVmWeE5970ixxjb9Okm4WIVHSvo1d7xH8voHdbPrBdibgFubOtd7wdIXRVLuzPaZXOpYE_CfCw1vB2CD76uzlf-V8xJmXiNmrm9O_zJ_ecEiCZ7xPEtWYZK2zB3LYpsqIgA"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start sm:justify-center p-5 sm:p-6 lg:p-8 pt-8 sm:pt-10 pb-10 relative">
          <div className="max-w-4xl w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 max-[800px]:gap-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Deep Behavioral <span className="text-primary">Insights</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light">
                Upload your high-fidelity video footage to initiate our
                proprietary perception engine analysis.
              </p>
            </div>



            <div className="w-full max-w-2xl glass-panel rounded-xl p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Analysis preset</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setSelectedPreset(preset.value)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${selectedPreset === preset.value ? "border-primary bg-primary/10 text-white" : "border-white/10 text-slate-300 hover:border-primary/50"}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="w-full max-w-2xl aspect-[16/9] glass-panel rounded-xl pulsing-upload-zone relative flex flex-col items-center justify-center gap-4 sm:gap-6 cursor-pointer group hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
              onClick={handleBrowse}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,.mkv,.webm"
                className="hidden"
                onChange={handleChange}
              />
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform duration-500">
                  <span
                    className="material-symbols-outlined text-3xl sm:text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    videocam
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-2 text-center px-4 sm:px-6">
                  Drop your video to begin perception analysis
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">or</span>
                  <button
                    className="text-primary font-semibold text-sm hover:underline decoration-2 underline-offset-4"
                    onClick={handleBrowse}
                    type="button"
                  >
                    browse local files
                  </button>
                </div>
              </div>

              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(236, 91, 19, 0.15) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {(selectedFile || isUploading || status !== "idle" || error) && (
              <div className="glass-panel px-5 py-3 rounded-xl text-sm text-slate-300 w-full max-w-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Upload</div>
                  <div className="text-white font-medium">
                    {selectedFile?.name ?? "Awaiting file"}
                  </div>
                </div>
                <div className="text-xs text-primary font-semibold uppercase tracking-widest">
                  {isUploading ? "Uploading..." : status}
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 max-w-2xl w-full text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-slate-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  <span>MP4 / MOV SUPPORTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  <span>UP TO 500MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  <span>AES-256 ENCRYPTED</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC__rwcp6dT9DuoJSeVJGWi6B1Bkcbb8MWyQ1Uuao_EJ8clg_ZqozzQ9EiIl_nzgwIsXvOjuNEPb8ttHLys_ovUTIIGgP0o_D90P88IpK8d4F-Fq7P2iweeFUnA6FxpTSl5nbQElP-O2gldw6l18nCRnrhM_HMVE9OTfD1QzggOlzQfm_LWABkZCf-fcrVOGGAZf3TzqsEiPJMA6RD97-BmX_h3TK30FJWjsikn6QoPUmJ6gB5vB3qHyoozz4dKvkvG5NmW6Cs7R20"
                    alt="Last upload thumbnail"
                  />
                  <div className="text-[10px]">
                    <p className="text-slate-400">LAST UPLOAD</p>
                    <p className="text-white font-medium">
                      {lastUploadName ?? "No uploads yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          <div className="glass-panel p-3 rounded-xl flex flex-col gap-4">
            <button className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="w-10 h-10 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <button className="w-10 h-10 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </aside>

        <footer className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6 glass-panel border-t border-white/5 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          <div>
            SYSTEM STATUS: <span className="text-emerald-500">OPERATIONAL</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Support
            </a>
          </div>
          <div>© 2024 PERCEPTION ENGINE V2.4</div>
        </footer>
      </div>
    </div>
  );
}
