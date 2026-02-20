import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { fetchJsonFromAny, resolveApiBases } from "@/lib/api";

const liveFindings = [
  {
    title: "Nervous touch at 00:00:14",
    detail: "Self-touch + shoulder tension spike. Likely anxiety response.",
    time: "00:00:14",
    tone: "#22d3ee",
  },
  {
    title: "Uncertainty cluster at 00:02:08",
    detail: "Hesitation + gaze aversion + micro tremor detected.",
    time: "00:02:08",
    tone: "#f59e0b",
  },
  {
    title: "Defensive posture at 00:04:22",
    detail: "Crossed arms + backward lean synchronized.",
    time: "00:04:22",
    tone: "#a855f7",
  },
];

const highlightedMoments = [
  {
    title: "Voice crash on keyword",
    detail: "VSI drops 48% when 'federal agents' is mentioned.",
    time: "00:03:41",
  },
  {
    title: "Stress spike + blink rate",
    detail: "Blink rate + respiration jump after Q5.",
    time: "00:05:10",
  },
  {
    title: "Contradiction marker",
    detail: "Verbal mismatch vs. head shake. Flagged for review.",
    time: "00:06:02",
  },
];

const channelFeeds = [
  {
    name: "Face",
    status: "Tracking",
    value: "Affect: Neutral",
    accent: "#22d3ee",
    spark: [22, 30, 40, 28, 35, 24, 32, 42, 38, 30],
  },
  {
    name: "AUs",
    status: "Active",
    value: "AU4 + AU12",
    accent: "#a855f7",
    spark: [10, 12, 18, 24, 16, 20, 28, 22, 18, 14],
  },
  {
    name: "Pose",
    status: "Leaning",
    value: "Back 12°",
    accent: "#60a5fa",
    spark: [8, 10, 14, 18, 22, 20, 16, 14, 12, 10],
  },
  {
    name: "Tensions",
    status: "High",
    value: "Shoulder + Neck",
    accent: "#f87171",
    spark: [12, 18, 26, 30, 34, 28, 24, 20, 22, 26],
  },
  {
    name: "Hands",
    status: "Self-touch",
    value: "2 events",
    accent: "#f59e0b",
    spark: [6, 8, 10, 14, 18, 24, 20, 16, 12, 10],
  },
  {
    name: "Text Emotions",
    status: "Mixed",
    value: "Uncertain 0.62",
    accent: "#34d399",
    spark: [14, 16, 18, 22, 20, 18, 16, 20, 24, 22],
  },
  {
    name: "Voice",
    status: "Jitter",
    value: "Pitch +4.2%",
    accent: "#f97316",
    spark: [10, 14, 18, 26, 32, 36, 28, 22, 18, 16],
  },
  {
    name: "Person ID",
    status: "Locked",
    value: "P1 · Brian",
    accent: "#e879f9",
    spark: [20, 22, 24, 24, 22, 20, 18, 18, 20, 22],
  },
];

type ChatMessage =
  | { role: "user"; text: string }
  | {
      role: "ai";
      title?: string;
      items?: { icon: string; text: string; time: string }[];
      summary: string;
      note?: string;
    };

type PersonProfile = {
  id: string;
  label?: string;
  role?: string;
};

const quickPrompts = [
  { key: "mismatches", label: "⚠️ Mismatches" },
  { key: "emotional", label: "📈 Emotional Peaks" },
  { key: "stress", label: "💗 Stress Indicators" },
  { key: "comparison", label: "👥 Person Comparison" },
  { key: "voice", label: "🎙️ Voice Analysis" },
];

const chatResponses: Record<string, ChatMessage> = {
  mismatches: {
    role: "ai",
    title: "⚠️ 3 Mismatches Detected",
    items: [
      {
        icon: "⚠️",
        text: "Verbal gratitude contradicts facial tension — positive words, stress markers present",
        time: "00:22",
      },
      {
        icon: "⚠️",
        text: "Calm voice masks rising shoulder tension — vocal stability 0.88 while posture stress increases",
        time: "02:48",
      },
      {
        icon: "🧩",
        text: "Composure breach — vocal stability drops 45% when topic shifts to enforcement",
        time: "03:00",
      },
    ],
    summary:
      "All three mismatches show a disconnect between controlled verbal output and physical tension.",
  },
  emotional: {
    role: "ai",
    title: "📈 5 Emotional Peaks Identified",
    items: [
      { icon: "💫", text: "Subject B — Duchenne smile, authentic warmth during opening", time: "00:12" },
      { icon: "💫", text: "Subject B — genuine engagement on enforcement policy", time: "01:34" },
      { icon: "💫", text: "Subject B — rapid authentic expressions during ICE discussion", time: "02:22" },
      { icon: "💫", text: "Subject A — peak postural tension during opening question", time: "00:08" },
      { icon: "💫", text: "Subject B — vocal composure breach, strongest signal in session", time: "03:00" },
    ],
    summary:
      "Subject B shows a clear emotional arc: controlled warmth → authentic engagement → composure loss.",
  },
  stress: {
    role: "ai",
    title: "💗 Stress Indicators Across Session",
    items: [
      { icon: "🧍", text: "Subject A — sustained shoulder elevation, rigid upper body throughout", time: "00:08" },
      { icon: "✋", text: "Subject A — repeated self-touch gestures (4 instances), self-regulatory", time: "00:18" },
      { icon: "🧍", text: "Subject B — rising shoulder tension while maintaining vocal control", time: "01:54" },
      { icon: "🎙️", text: "Subject B — voice stability crash from 0.86 to 0.47", time: "03:00" },
    ],
    summary:
      "Subject B maintains controlled stress until the final segment where physical indicators break through.",
  },
  comparison: {
    role: "ai",
    title: "👥 Subject Comparison",
    items: [
      { icon: "🟠", text: "Subject A — findings: 8, avg confidence 64%", time: "Summary" },
      { icon: "🔵", text: "Subject B — findings: 19, avg confidence 52%", time: "Summary" },
    ],
    summary:
      "Subject B displays 2.4x more behavioral findings despite appearing more composed.",
  },
  voice: {
    role: "ai",
    title: "🎙️ Voice Analysis",
    items: [
      { icon: "🟠", text: "Subject A — stable cadence, minimal jitter", time: "00:40" },
      { icon: "🔵", text: "Subject B — pitch variance peak +12% in Q3 response", time: "01:10" },
      { icon: "🔵", text: "Subject B — jitter spike detected", time: "02:31" },
    ],
    summary: "Prosody shifts align with composure breach moments.",
  },
};

const overlayTabs = [
  "Base Feed",
  "Face",
  "AUs",
  "Pose",
  "Hands",
  "Voice",
  "Text",
  "All Overlays",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "P";

function sparkPath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const normalized = (value - min) / (max - min || 1);
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function getVideoFilename(path: string | null) {
  if (!path) return null;
  const parts = path.split("/");
  return parts[parts.length - 1] || null;
}

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function buildVideoCandidates(
  videoPath: string | null,
  assetBase: string,
  apiBase: string,
) {
  if (!videoPath) return [];
  const normalizedPath = videoPath.replace(/^\/+/, "");
  const filename = getVideoFilename(videoPath);
  const candidates = [
    filename ? `${assetBase}/videos/${encodeURIComponent(filename)}` : null,
    filename ? `${apiBase}/videos/${encodeURIComponent(filename)}` : null,
    `${assetBase}/${normalizedPath}`,
    `${apiBase}/${normalizedPath}`,
    videoPath.startsWith("http") ? videoPath : null,
  ].filter((value): value is string => Boolean(value));
  return Array.from(new Set(candidates));
}

export default function CommandCenterScreen() {
  const { getPersonNamesForSession, savePersonNamesForSession } = useSession();
  const [activeOverlay, setActiveOverlay] = useState(overlayTabs[0]);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<
    { session_id: string; created_at: string; video: string; chunks: number }[]
  >([]);
  const [availableSessions, setAvailableSessions] = useState<
    { session_id: string; created_at: string; video: string; chunks: number }[]
  >([]);
  const [personProfiles, setPersonProfiles] = useState<PersonProfile[]>([]);
  const [personNames, setPersonNames] = useState<Record<string, string>>({});
  const [thumbErrors, setThumbErrors] = useState<Record<string, boolean>>({});
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoCandidateIndex, setVideoCandidateIndex] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [sessionLoadError, setSessionLoadError] = useState<string | null>(null);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(
    window.localStorage.getItem("opm_session_id") ?? "demo-session",
  );
  const apiBase = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/$/, "");
  const assetBase = (
    import.meta.env.VITE_API_ASSET_BASE ||
    import.meta.env.VITE_API_PROXY_TARGET ||
    apiBase
  ).replace(/\/$/, "");
  const overlayLabel = useMemo(() => {
    if (activeOverlay === "Base Feed") return "Base feed visible";
    if (activeOverlay === "All Overlays") return "All overlays active";
    return `${activeOverlay} overlay active`;
  }, [activeOverlay]);
  const apiBases = useMemo(() => resolveApiBases(apiBase), [apiBase]);
  const displayedProfiles = useMemo(
    () =>
      personProfiles.length
        ? personProfiles
        : [
            { id: "0", label: "Person 1", role: "Subject" },
            { id: "1", label: "Person 2", role: "Subject" },
          ],
    [personProfiles],
  );

  const updatePersonName = (index: number, value: string) => {
    setPersonNames((prev) => {
      const next = { ...prev, [String(index)]: value };
      if (activeSessionId) {
        savePersonNamesForSession(activeSessionId, next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!apiBases.length) return;
    let ignore = false;
    const loadSessions = async () => {
      try {
        const { data } = await fetchJsonFromAny<{
          sessions?: {
            session_id: string;
            created_at: string;
            video: string;
            chunks: number;
          }[];
        }>(apiBases, "/sessions");
        if (ignore) return;
        setSessionLoadError(null);
        const list = Array.isArray(data?.sessions) ? data.sessions : [];
        setSessions(list);
        if (list.length) {
          const withThumbs: typeof list = [];
          for (const session of list) {
            try {
              const check = await fetch(
                `${assetBase}/thumbnails/${session.session_id}/person_0.jpg`,
              );
              if (check.ok) {
                withThumbs.push(session);
              }
            } catch {
              // ignore
            }
          }
          setAvailableSessions(withThumbs);
          const source = withThumbs.length ? withThumbs : list;
          const stored = window.localStorage.getItem("opm_session_id");
          const valid = source.some((item: { session_id: string }) => item.session_id === stored);
          const nextId = valid ? stored! : source[0].session_id;
          if (nextId && nextId !== activeSessionId) {
            setActiveSessionId(nextId);
            window.localStorage.setItem("opm_session_id", nextId);
          }
        }
      } catch (error) {
        if (!ignore) {
          setSessionLoadError(
            `Connection failed (${error instanceof Error ? error.message : "unknown error"})`,
          );
          setSessions([]);
          setAvailableSessions([]);
        }
      }
    };
    loadSessions();
    return () => {
      ignore = true;
    };
  }, [apiBases, assetBase, activeSessionId]);

  const activeSession = sessions.find(
    (session) => session.session_id === activeSessionId,
  );
  const videoCandidates = useMemo(
    () => buildVideoCandidates(activeSession?.video ?? null, assetBase, apiBase),
    [activeSession?.video, assetBase, apiBase],
  );
  const videoUrl = videoCandidates[videoCandidateIndex] ?? null;

  useEffect(() => {
    if (!apiBases.length || !activeSessionId) return;
    let ignore = false;
    const loadProfiles = async () => {
      try {
        const { data } = await fetchJsonFromAny<{
          session?: { person_profiles?: { id?: string; label?: string; role?: string }[] };
        }>(apiBases, `/results/${activeSessionId}`);
        if (ignore) return;
        const profiles = Array.isArray(data?.session?.person_profiles)
          ? data.session.person_profiles
          : [];
        const normalized: PersonProfile[] = profiles.map(
          (profile: { id?: string; label?: string; role?: string }, index: number) => ({
            id: profile.id ?? String(index),
            label: profile.label ?? `Person ${index + 1}`,
            role: profile.role ?? "",
          }),
        );
        const resolvedProfiles = normalized.length
          ? normalized
          : [{ id: "0", label: "Person 1", role: "Subject" }];
        setPersonProfiles(resolvedProfiles);
        const savedNames = getPersonNamesForSession(activeSessionId);
        const nextNames: Record<string, string> = {};
        resolvedProfiles.forEach((profile: PersonProfile, index: number) => {
          nextNames[String(index)] =
            savedNames[String(index)] ??
            profile.label ??
            `Person ${index + 1}`;
        });
        setPersonNames(nextNames);
        if (activeSessionId) {
          savePersonNamesForSession(activeSessionId, nextNames);
        }
        const promptKey = `opm_identity_prompted_${activeSessionId}`;
        const hasPrompted = window.localStorage.getItem(promptKey) === "1";
        if (!ignore && !hasPrompted) {
          window.localStorage.setItem(promptKey, "1");
          setShowIdentityModal(true);
        }
      } catch {
        // ignore
      }
    };
    loadProfiles();
    return () => {
      ignore = true;
    };
  }, [
    apiBases,
    activeSessionId,
    getPersonNamesForSession,
    savePersonNamesForSession,
  ]);

  useEffect(() => {
    setThumbErrors({});
    setVideoError(null);
    setVideoCandidateIndex(0);
    setVideoCurrentTime(0);
    setVideoDuration(0);
  }, [activeSessionId]);

  const fetchAvailableSessionId = async (): Promise<string | null> => {
    if (!apiBases.length) return null;
    try {
      const { data } = await fetchJsonFromAny<{
        sessions?: { session_id: string }[];
      }>(apiBases, "/sessions");
      if (data?.sessions?.length) {
        const id = data.sessions[0].session_id as string;
        if (id) {
          window.localStorage.setItem("opm_session_id", id);
          return id;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const requestChatResponse = async (input: string): Promise<ChatMessage> => {
    if (!apiBases.length) {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      return {
        role: "ai",
        title: "🔎 Inquiry (Demo)",
        note: "Backend not connected yet. Showing closest evidence sample.",
        items: [
          { icon: "🧩", text: "Top mismatch cluster aligns with enforcement segment", time: "00:03:41" },
          { icon: "💗", text: "Stress indicators rise for Subject B prior to breach", time: "00:02:48" },
        ],
        summary: "Try: “Where is uncertainty?”, “Show stress spikes”, or “Summarize Subject B”.",
      };
    }

    try {
      const { data } = await fetchJsonFromAny<{
        answer?: string;
        sources?: number[];
        detail?: string;
      }>(apiBases, "/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSessionId,
          person_names: personNames,
          question: input,
        }),
      });
      if (data && typeof data === "object" && "answer" in data && data.answer) {
        const sources: number[] = Array.isArray(data.sources) ? data.sources : [];
        return {
          role: "ai",
          title: "",
          note: sources.length
            ? `Evidence: ${sources.map((source) => `chunk ${source}`).join(", ")}`
            : undefined,
          items: sources.length
            ? sources.map((source) => ({
                icon: "🔗",
                text: `Referenced evidence from chunk ${source}`,
                time: `chunk ${source}`,
              }))
            : undefined,
          summary: data.answer as string,
        };
      }

      if (data?.detail?.toString().includes("not found")) {
        const fallbackId = await fetchAvailableSessionId();
        if (fallbackId) {
          const { data: retryData } = await fetchJsonFromAny<{
            answer?: string;
            sources?: number[];
          }>(apiBases, "/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: fallbackId,
              person_names: personNames,
              question: input,
            }),
          });
          if (retryData?.answer) {
            return {
              role: "ai",
              title: "",
              note: retryData.sources?.length
                ? `Evidence: ${retryData.sources.map((source: number) => `chunk ${source}`).join(", ")}`
                : undefined,
              items: retryData.sources?.length
                ? (retryData.sources ?? []).map((source: number) => ({
                    icon: "🔗",
                    text: `Referenced evidence from chunk ${source}`,
                    time: `chunk ${source}`,
                  }))
                : undefined,
              summary: retryData.answer,
            } as ChatMessage;
          }
        }
      }
    } catch (error) {
      // Fallback to demo when API is unavailable.
    }

    const lower = input.toLowerCase();
    if (lower.includes("mismatch")) return chatResponses.mismatches;
    if (lower.includes("emotional")) return chatResponses.emotional;
    if (lower.includes("stress")) return chatResponses.stress;
    if (lower.includes("compare")) return chatResponses.comparison;
    if (lower.includes("voice")) return chatResponses.voice;
    return {
      role: "ai",
      title: "🔎 Inquiry (Demo)",
      note: "Backend not connected yet. Showing closest evidence sample.",
      items: [
        { icon: "🧩", text: "Top mismatch cluster aligns with enforcement segment", time: "00:03:41" },
        { icon: "💗", text: "Stress indicators rise for Subject B prior to breach", time: "00:02:48" },
      ],
      summary: "Try: “Where is uncertainty?”, “Show stress spikes”, or “Summarize Subject B”.",
    };
  };

  const handlePrompt = async (key: string, label: string) => {
    setChatExpanded(true);
    const response = chatResponses[key];
    setChatMessages([{ role: "user", text: label }, response]);
  };

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatExpanded(true);
    setChatMessages([{ role: "user", text: trimmed }]);
    setIsTyping(true);
    setChatInput("");
    const response = await requestChatResponse(trimmed);
    setIsTyping(false);
    setChatMessages([{ role: "user", text: trimmed }, response]);
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-display"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(0,255,255,0.08), transparent 60%), radial-gradient(1000px 650px at 85% 10%, rgba(236,91,19,0.08), transparent 60%), #0a0b0f",
      }}
    >
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0b0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-primary/90 flex items-center justify-center text-black font-bold">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
            <div className="text-xs font-semibold tracking-[0.3em] uppercase">
              Sentinel <span className="text-primary">Analytics</span>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Session #402-A // Live
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="relative hidden md:block">
              <button
                onClick={() => setSessionMenuOpen((prev) => !prev)}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-primary/40"
              >
                Session: {activeSessionId}
              </button>
              {sessionMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#11131c] p-2 shadow-xl z-50">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Available Sessions
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {(availableSessions.length ? availableSessions : sessions).map((session) => (
                      <button
                        key={session.session_id}
                        onClick={() => {
                          setActiveSessionId(session.session_id);
                          window.localStorage.setItem("opm_session_id", session.session_id);
                          setSessionMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                          session.session_id === activeSessionId
                            ? "bg-primary/10 text-white border border-primary/30"
                            : "text-white/70 hover:bg-white/5"
                        }`}
                      >
                        <div className="font-mono text-[11px]">{session.session_id}</div>
                        <div className="text-[10px] text-white/40 truncate">
                          {session.video}
                        </div>
                      </button>
                    ))}
                    {!sessions.length && (
                      <div className="px-3 py-2 text-xs text-white/40">
                        No sessions available.
                      </div>
                    )}
                    {sessionLoadError && (
                      <div className="px-3 py-2 text-xs text-amber-300/90">
                        {sessionLoadError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Processing time: 00:04:12
            </div>
            <button className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
            <button className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-orange-600 border border-white/20" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 py-8 pb-48">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {overlayTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveOverlay(tab)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all ${
                    tab === activeOverlay
                      ? "border-primary/60 text-white bg-primary/10"
                      : "border-white/10 text-white/60 hover:text-white hover:border-primary/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
              {overlayLabel}
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0f1118]/80 overflow-hidden">
              <div className="relative aspect-video bg-black">
                {videoUrl ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={videoUrl}
                    controls
                    onLoadedData={() => setVideoError(null)}
                    onLoadedMetadata={(event) => {
                      setVideoDuration(event.currentTarget.duration || 0);
                      setVideoCurrentTime(event.currentTarget.currentTime || 0);
                    }}
                    onTimeUpdate={(event) =>
                      setVideoCurrentTime(event.currentTarget.currentTime || 0)
                    }
                    onError={() => {
                      if (videoCandidateIndex + 1 < videoCandidates.length) {
                        setVideoCandidateIndex((prev) => prev + 1);
                        return;
                      }
                      setVideoError(
                        activeSession?.video
                          ? `Unable to load video for session ${activeSessionId}.`
                          : "No video filename returned for this session.",
                      );
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
                    No video available for this session
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute left-6 top-6 flex gap-2 text-[10px] font-mono uppercase">
                  <span className="rounded border border-primary/30 bg-black/60 px-2 py-1 text-primary">Cam 02</span>
                  <span className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70">1080p / 60fps</span>
                </div>
                <div className="absolute left-[28%] top-[34%] h-32 w-32 rounded-xl border border-cyan-400/40 p-2 pointer-events-none">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="bg-cyan-400 px-1 text-black">P0</span>
                  </div>
                  <div className="mt-auto text-right text-[10px] font-mono text-cyan-200/80">HR: 82</div>
                </div>
                <div className="absolute right-[22%] top-[38%] h-28 w-28 rounded-xl border border-fuchsia-400/40 p-2 text-[10px] pointer-events-none">
                  <span className="bg-fuchsia-400 px-1 text-black">P1</span>
                </div>
              </div>
              {videoError && (
                <div className="border-t border-red-500/30 bg-red-500/10 px-6 py-3 text-xs text-red-200">
                  {videoError}
                </div>
              )}
              <div className="flex items-center justify-between gap-4 border-t border-white/5 px-6 py-3 text-xs text-white/55">
                <div className="font-mono">
                  {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
                </div>
                <div className="uppercase tracking-[0.2em]">
                  Native player timeline active
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12141c]/85 p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Subject Dossiers
                </div>
                <button
                  onClick={() => setShowIdentityModal(true)}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-primary/40"
                >
                  Identify Subjects
                </button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {displayedProfiles.map((profile, index) => (
                  <div
                    key={`${profile.id}-${index}`}
                    className={`rounded-2xl border p-5 ${
                      index === 1 ? "border-primary/30 bg-black/20" : "border-white/10 bg-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative">
                        {!thumbErrors[`${activeSessionId}-${index}`] && (
                          <img
                            className="h-full w-full object-cover"
                            src={`${assetBase}/thumbnails/${activeSessionId}/person_${index}.jpg`}
                            alt={`Subject ${index + 1}`}
                            onError={() =>
                              setThumbErrors((prev) => ({
                                ...prev,
                                [`${activeSessionId}-${index}`]: true,
                              }))
                            }
                          />
                        )}
                        {thumbErrors[`${activeSessionId}-${index}`] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2233] to-[#12141c] text-[10px] text-white/70 font-semibold">
                            {getInitials(personNames[String(index)] ?? profile.label ?? `P${index + 1}`)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                          Subject {String.fromCharCode(65 + index)}
                        </div>
                        <div className="text-sm text-white/80">{profile.role}</div>
                        <input
                          value={personNames[String(index)] ?? profile.label ?? ""}
                          onChange={(event) => updatePersonName(index, event.target.value)}
                          className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-primary/50"
                          placeholder={`Person ${index + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-[#12141c]/85 p-6">
              <div className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
                Mission Briefing
              </div>
              <div className="mt-3 text-lg font-semibold leading-relaxed">
                Subject B shows sustained emotional labor between 04:20 and 04:50.
                Prioritize stress markers and verbal mismatch signals.
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/60">
                <span>Confidence: 94.2%</span>
                <span>Signals: Voice + Pose + AUs</span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12141c]/85 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>Live Analysis</span>
                <span className="text-primary">Syncing</span>
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {liveFindings.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold">{item.title}</div>
                      <div className="text-xs text-white/50">{item.time}</div>
                    </div>
                    <div className="mt-2 text-sm text-white/70">{item.detail}</div>
                    <div
                      className="mt-4 h-2 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{ width: "70%", background: item.tone }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0f1118]/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Multi-Channel Monitor
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {channelFeeds.map((channel) => (
              <div
                key={channel.name}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    {channel.name}
                  </div>
                  <span
                    className="text-[11px] uppercase"
                    style={{ color: channel.accent }}
                  >
                    {channel.status}
                  </span>
                </div>
                <div className="mt-2 text-base text-white/80">
                  {channel.value}
                </div>
                <svg
                  viewBox="0 0 140 36"
                  className="mt-4 h-9 w-full"
                  aria-hidden="true"
                >
                  <path
                    d={sparkPath(channel.spark, 140, 36)}
                    fill="none"
                    stroke={channel.accent}
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </svg>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Live feed
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-[#12141c]/85 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">
              System Highlighted Moments
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {highlightedMoments.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">{item.title}</div>
                    <div className="text-xs text-white/50">{item.time}</div>
                  </div>
                  <div className="mt-2 text-sm text-white/70">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {showIdentityModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0f1118] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Identify Subjects
                </div>
                <div className="mt-2 text-lg font-semibold text-white/90">
                  Identify detected people for this session
                </div>
              </div>
              <button
                onClick={() => setShowIdentityModal(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-primary/40"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedProfiles.map((profile, index) => (
                <div key={`id-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 rounded-2xl overflow-hidden border border-white/10 bg-[#12141c] relative">
                      {!thumbErrors[`${activeSessionId}-${index}`] && (
                        <img
                          src={`${assetBase}/thumbnails/${activeSessionId}/person_${index}.jpg`}
                          alt={`Person ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={() =>
                            setThumbErrors((prev) => ({
                              ...prev,
                              [`${activeSessionId}-${index}`]: true,
                            }))
                          }
                        />
                      )}
                      {thumbErrors[`${activeSessionId}-${index}`] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2233] to-[#12141c] text-lg text-white/70 font-semibold">
                          {getInitials(personNames[String(index)] ?? profile.label ?? `P${index + 1}`)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Subject {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        value={personNames[String(index)] ?? ""}
                        onChange={(event) => updatePersonName(index, event.target.value)}
                        className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-primary/60"
                        placeholder={`Name for person ${index + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowIdentityModal(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-primary/40"
              >
                Later
              </button>
              <button
                onClick={() => {
                  if (activeSessionId) {
                    savePersonNamesForSession(activeSessionId, personNames);
                  }
                  setShowIdentityModal(false);
                }}
                className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-black font-semibold"
              >
                Save Names
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-[#0b0c12] border-t border-white/10 px-6 pb-5 shadow-[0_-18px_40px_rgba(0,0,0,0.6)] z-50">
        <div className={`max-w-[1400px] mx-auto transition-all duration-300 ${chatExpanded ? "pt-4" : "pt-2"}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">
              Command Chat
            </div>
            <button
              onClick={() => setChatExpanded((prev) => !prev)}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-primary/40"
            >
              {chatExpanded ? "Minimize" : "Expand"}
            </button>
          </div>

          {chatExpanded && (
            <>
              <div
                className={`transition-all duration-300 ${
                  chatExpanded ? "max-h-[420px]" : "max-h-0"
                } overflow-hidden`}
              >
                <div className="flex flex-col gap-3 pb-4 max-h-[360px] overflow-y-auto pr-2">
                  {chatMessages.length === 0 && (
                    <div className="text-xs text-white/50">
                      Ask a question or choose a quick filter to surface insights.
                    </div>
                  )}
                  {chatMessages.map((msg, index) => {
                    if (msg.role === "user") {
                      return (
                        <div
                          key={`user-${index}`}
                          className="self-end rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm"
                        >
                          {msg.text}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`ai-${index}`}
                        className="rounded-2xl border border-white/10 bg-[#141621] p-4"
                      >
                    {msg.title && <div className="text-sm font-semibold">{msg.title}</div>}
                    {msg.note && (
                      <div className="mt-2 text-xs text-white/50">{msg.note}</div>
                    )}
                    {msg.items && msg.items.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.items.map((item) => (
                          <div
                            key={`${item.text}-${item.time}`}
                            className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                          >
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <span className="text-sm">{item.icon}</span>
                            </div>
                            <div className="text-sm text-white/70 flex-1">
                              {item.text}
                            </div>
                            <div className="text-xs text-primary font-mono">
                              {item.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={`text-sm text-white/70 ${
                        msg.items && msg.items.length > 0
                          ? "mt-3 border-t border-white/5 pt-3"
                          : "mt-2"
                      }`}
                    >
                      {msg.summary}
                    </div>
                  </div>
                );
                  })}
                </div>
              </div>

              {isTyping && (
                <div className="max-w-[1400px] mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#141621] px-4 py-3 text-white/60">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
                    </span>
                    Generating response…
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.key}
                onClick={() => handlePrompt(prompt.key, prompt.label)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white hover:border-primary/40 hover:shadow-[0_0_18px_rgba(236,91,19,0.35)]"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 rounded-full border border-white/15 bg-[#141621] px-5 py-4 text-white/80 placeholder:text-white/40 focus:outline-none focus:border-primary/60 focus:shadow-[0_0_0_3px_rgba(236,91,19,0.12)]"
              placeholder="Ask anything about this session..."
            />
            <button
              onClick={handleSend}
              className="h-12 w-12 rounded-full bg-primary text-black flex items-center justify-center hover:shadow-[0_0_18px_rgba(236,91,19,0.5)]"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
