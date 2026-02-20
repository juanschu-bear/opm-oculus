import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { fetchJsonFromAny, resolveApiBases } from "@/lib/api";

type SessionRow = {
  session_id: string;
  created_at: string;
  video: string;
  chunks: number;
};

export default function DashboardScreen() {
  const { apiBase, setSessionId } = useSession();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBases = resolveApiBases(apiBase);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const { data } = await fetchJsonFromAny<{ sessions?: SessionRow[] }>(
          apiBases,
          "/sessions",
        );
        if (ignore) return;
        setError(null);
        setSessions(Array.isArray(data?.sessions) ? data.sessions : []);
      } catch (err) {
        if (!ignore) {
          setError(
            `Connection failed (${err instanceof Error ? err.message : "unknown error"})`,
          );
          setSessions([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [apiBase]);

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white font-display">
      <header className="border-b border-white/5 bg-[#0a0b0f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/90 flex items-center justify-center text-black">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">OPM</div>
              <div className="text-lg font-semibold">Operations Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <button
              className="rounded-full border border-white/10 px-3 py-1 hover:text-white"
              onClick={() => (window.location.hash = "upload")}
            >
              New Upload
            </button>
            <button
              className="rounded-full border border-white/10 px-3 py-1 hover:text-white"
              onClick={() => (window.location.hash = "command")}
            >
              Command Center
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="rounded-3xl border border-white/10 bg-[#11131c]/90 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/40">Sessions</div>
              <h2 className="text-xl font-semibold text-white mt-2">Analysis Archive</h2>
            </div>
            <div className="text-xs text-white/50">{sessions.length} sessions</div>
          </div>

          <div className="mt-6 space-y-4">
            {loading && <div className="text-sm text-white/50">Loading sessions…</div>}
            {!loading && sessions.length === 0 && (
              <div className="text-sm text-white/50">No sessions yet.</div>
            )}
            {error && <div className="text-sm text-amber-300/90">{error}</div>}
            {sessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => {
                  setSessionId(session.session_id);
                  window.location.hash = "command";
                }}
                className="w-full text-left rounded-2xl border border-white/10 bg-black/30 px-4 py-4 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{session.video}</div>
                    <div className="text-xs text-white/50 font-mono mt-1">{session.session_id}</div>
                  </div>
                  <div className="text-xs text-primary">{session.chunks} chunks</div>
                </div>
                <div className="mt-2 text-xs text-white/40">{new Date(session.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#11131c]/90 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Quick Actions</div>
          <div className="mt-4 grid gap-4">
            <button
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-left hover:border-primary/40"
              onClick={() => (window.location.hash = "upload")}
            >
              <div className="text-sm font-semibold text-white">Upload New Video</div>
              <div className="text-xs text-white/50 mt-1">Start a fresh analysis pipeline</div>
            </button>
            <button
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-left hover:border-primary/40"
              onClick={() => (window.location.hash = "comparison")}
            >
              <div className="text-sm font-semibold text-white">Comparison Report</div>
              <div className="text-xs text-white/50 mt-1">Review subject divergences</div>
            </button>
            <button
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-left hover:border-primary/40"
              onClick={() => (window.location.hash = "findings")}
            >
              <div className="text-sm font-semibold text-white">Findings Log</div>
              <div className="text-xs text-white/50 mt-1">Detailed event timeline</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
