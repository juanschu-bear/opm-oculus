import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { fetchJsonFromAny, resolveApiBases } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";

type PanelKey =
  | "mismatches"
  | "emotional"
  | "stress"
  | "comparison"
  | "voice";

type ChatMessage =
  | { role: "user"; text: string }
  | {
      role: "ai";
      title: string;
      items: { icon: string; text: string; time: string; tag?: string }[];
      summary: string;
    }
  | {
      role: "ai";
      title: string;
      comparison: [Record<string, string>, Record<string, string>];
      summary: string;
    }
  | {
      role: "ai";
      title: string;
      groups: { label: string; items: { icon: string; text: string; time: string }[] }[];
      summary: string;
    }
  | {
      role: "ai";
      title: string;
      note: string;
      items: { icon: string; text: string; time: string; tag?: string }[];
      summary: string;
    };

type PersonProfile = {
  id: string;
  label?: string;
  role?: string;
};

const panelLabels: Record<PanelKey, string> = {
  mismatches: "Mismatches",
  emotional: "Emotional Peaks",
  stress: "Stress Indicators",
  comparison: "Person Comparison",
  voice: "Voice Analysis",
};

const quickPrompts: { key: PanelKey; label: string }[] = [];

const responses: Partial<Record<PanelKey, ChatMessage>> = {};

const subjectA = { name: "Subject A", role: "", person: "", metrics: {} as Record<string, string>, strengths: [] as string[], weaknesses: [] as string[] };

const subjectB = { name: "Subject B", role: "", person: "", metrics: {} as Record<string, string>, strengths: [] as string[], weaknesses: [] as string[] };

const divergenceMetrics: { label: string; a: string; b: string; delta: string; severity: string }[] = [];

const overlayOptions: string[] = [];

const windowOptions: string[] = [];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "P";

export default function ComparisonSummaryScreen() {
  const { getPersonNamesForSession, savePersonNamesForSession } = useSession();
  const [activePanel, setActivePanel] = useState<PanelKey>("comparison");
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [jumpTo, setJumpTo] = useState<string | null>(null);
  const [overlayMenuOpen, setOverlayMenuOpen] = useState(false);
  const [windowMenuOpen, setWindowMenuOpen] = useState(false);
  const [overlaySelection, setOverlaySelection] = useState(overlayOptions[0] ?? "");
  const [windowSelection, setWindowSelection] = useState(windowOptions[0] ?? "");
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

  const panel = responses[activePanel] ?? null;

  const handlePrompt = (key: PanelKey) => {
    setActivePanel(key);
    setChatExpanded(true);
    setChatMessages([
      { role: "user", text: `Show me the ${panelLabels[key].toLowerCase()}` },
    ]);
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setChatMessages([
        { role: "user", text: `Show me the ${panelLabels[key].toLowerCase()}` },
        responses[key] ?? { role: "ai", title: "No data", items: [], summary: "No data available." },
      ]);
    }, 550);
  };

  const handleJump = (time: string) => {
    setJumpTo(time);
    window.setTimeout(() => setJumpTo(null), 1800);
  };

  const resolvePanelFromInput = (input: string): { key: PanelKey; matched: boolean } => {
    const lower = input.toLowerCase();
    if (lower.includes("mismatch")) return { key: "mismatches", matched: true };
    if (lower.includes("emotional")) return { key: "emotional", matched: true };
    if (lower.includes("stress")) return { key: "stress", matched: true };
    if (lower.includes("compare") || lower.includes("comparison")) {
      return { key: "comparison", matched: true };
    }
    if (lower.includes("voice")) return { key: "voice", matched: true };
    return { key: activePanel, matched: false };
  };

  const buildCustomResponse = (input: string): ChatMessage => {
    const lower = input.toLowerCase();
    const isTruthQuestion =
      lower.includes("lie") ||
      lower.includes("lying") ||
      lower.includes("gelogen") ||
      lower.includes("lügt");

    if (isTruthQuestion) {
      return {
        role: "ai",
        title: "🧠 Integrity Check (Demo)",
        note:
          "This demo does not determine deception. A backend model would be required to answer this with confidence.",
        items: [
          {
            icon: "⚠️",
            text: "Subject B shows a composure breach with vocal instability",
            time: "03:00",
          },
          {
            icon: "🧍",
            text: "Subject A maintains consistent stress markers without a breach",
            time: "01:54",
          },
        ],
        summary:
          "You can ask for mismatches, stress indicators, or voice analysis to see evidence fragments.",
      };
    }

    return {
      role: "ai",
      title: "🔎 Inquiry (Demo)",
      note:
        "Free-text Q&A is available once the backend LLM is connected. This demo returns the closest panel evidence.",
      items: [
        {
          icon: "🧩",
          text: "Top mismatch cluster aligns with enforcement segment",
          time: "03:00",
        },
        {
          icon: "💗",
          text: "Stress indicators rise for Subject B prior to breach",
          time: "02:48",
        },
      ],
      summary:
        "Try: “Show mismatches”, “Voice analysis”, or “Person comparison”.",
    };
  };

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
          setActiveSessionId(id);
          return id;
        }
      }
    } catch {
      return null;
    }
    return null;
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

  useEffect(() => {
    if (!apiBases.length || !activeSessionId) return;
    let ignore = false;
    const loadProfiles = async () => {
      try {
        const { data } = await fetchJsonFromAny<{
          session?: {
            person_profiles?: { id?: string; label?: string; role?: string }[];
          };
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
        const hasUnnamed = Object.values(nextNames).some(
          (name) => !name || !name.trim(),
        );
        if (!ignore && (hasUnnamed || !Object.keys(savedNames).length)) {
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
  }, [activeSessionId]);

  const requestChatResponse = async (
    input: string,
    panelMatch: { key: PanelKey; matched: boolean },
  ): Promise<ChatMessage> => {
    if (!apiBases.length) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      return panelMatch.matched ? (responses[panelMatch.key] ?? buildCustomResponse(input)) : buildCustomResponse(input);
    }

    try {
      const { data } = await fetchJsonFromAny<{
        role?: string;
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
      if (data && typeof data === "object") {
        if ("role" in data) return data as ChatMessage;
        if ("answer" in data) {
          const sources: number[] = Array.isArray(data.sources)
            ? data.sources
            : [];
          return {
            role: "ai",
            title: "",
            note: sources.length
              ? `Sources: ${sources.map((source) => `chunk ${source}`).join(", ")}`
              : undefined,
            items: sources.map((source) => ({
              icon: "🔗",
              text: `Referenced evidence from chunk ${source}`,
              time: `chunk ${source}`,
            })),
            summary: data.answer,
          } as ChatMessage;
        }
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
                ? `Sources: ${retryData.sources.map((source: number) => `chunk ${source}`).join(", ")}`
                : undefined,
              items: (retryData.sources ?? []).map((source: number) => ({
                icon: "🔗",
                text: `Referenced evidence from chunk ${source}`,
                time: `chunk ${source}`,
              })),
              summary: retryData.answer,
            } as ChatMessage;
          }
        }
      }
    } catch (error) {
      // Fallback to demo response when API is not connected.
    }

    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (!panelMatch.matched) {
      return buildCustomResponse(input);
    }
    return responses[panelMatch.key] ?? buildCustomResponse(input);
  };

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const panelMatch = resolvePanelFromInput(trimmed);
    setActivePanel(panelMatch.key);
    setChatExpanded(true);
    setChatMessages([{ role: "user", text: trimmed }]);
    setIsTyping(true);
    setChatInput("");
    const response = await requestChatResponse(trimmed, panelMatch);
    setIsTyping(false);
    setChatMessages([{ role: "user", text: trimmed }, response]);
  };

  const comparisonCards = useMemo(() => {
    if (!panel || panel.role !== "ai" || !("comparison" in panel)) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {panel.comparison.map((stats, index) => (
          <div
            key={`compare-${index}`}
            className={`rounded-2xl border px-4 py-3 bg-black/30 ${
              index === 0
                ? "border-primary/30"
                : "border-blue-500/30"
            }`}
          >
            <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
              {index === 0 ? "Subject A" : "Subject B"}
            </div>
            <div className="space-y-2">
              {Object.entries(stats).map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/60">{label}</span>
                  <span className="text-white/90 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }, [panel]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-100 min-h-screen relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="ambient-glow top-[-10%] left-[-10%]" />
      <div
        className="ambient-glow bottom-[-10%] right-[-10%]"
        style={{
          background:
            "radial-gradient(circle, rgba(15, 23, 42, 0.5) 0%, rgba(10, 10, 12, 0) 70%)",
        }}
      />

      <header className="border-b border-white/5 bg-[#0a0b0f]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/90 flex items-center justify-center text-black">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </div>
            <div className="text-xs uppercase tracking-[0.3em]">
              OPM <span className="text-primary">Perception Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" /> Session Active
            </div>
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
            <div className="hidden md:block">Comparison Mode</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-44 flex flex-col gap-10 relative z-10">
        <section className="rounded-3xl border border-primary/40 bg-[#11131c]/85 p-6 shadow-[0_0_30px_rgba(236,91,19,0.2)]">
          <div className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
            Comparison Summary
          </div>
          <div className="mt-3 text-xl md:text-2xl font-semibold leading-relaxed">
            Subject A vs Subject B — composure breach at 3:00 and divergence
            after enforcement topic.
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-xs text-white/60">
            <span>3:13 duration</span>
            <span>2 subjects</span>
            <span>29 findings</span>
            <span>6 channels</span>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <div className="uppercase tracking-[0.3em]">Comparison Arena</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowIdentityModal(true)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 hover:border-primary/40"
              >
                Identify Subjects
              </button>
              <div className="relative">
                <button
                  onClick={() => setOverlayMenuOpen((prev) => !prev)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 hover:border-primary/40"
                >
                  {overlaySelection} ▾
                </button>
                {overlayMenuOpen && (
                  <div className="absolute top-12 left-0 rounded-xl border border-white/10 bg-[#12141c] p-2 w-48 z-20">
                    {overlayOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setOverlaySelection(option);
                          setOverlayMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setWindowMenuOpen((prev) => !prev)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 hover:border-primary/40"
                >
                  {windowSelection} ▾
                </button>
                {windowMenuOpen && (
                  <div className="absolute top-12 left-0 rounded-xl border border-white/10 bg-[#12141c] p-2 w-48 z-20">
                    {windowOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setWindowSelection(option);
                          setWindowMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr_1fr] gap-6 items-stretch">
            {displayedProfiles.slice(0, 2).map((subject, index) => (
              <div
                key={`${subject.id}-arena`}
                className={`rounded-3xl border p-6 bg-[#0f1118]/90 ${
                  index === 0 ? "border-primary/40" : "border-blue-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-24 w-24 rounded-2xl bg-white/10 overflow-hidden border border-white/10 relative">
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
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2233] to-[#12141c] text-xs text-white/70 font-semibold">
                          {getInitials(personNames[String(index)] ?? subject.label ?? `P${index + 1}`)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Subject {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-base text-white/90">
                        {personNames[String(index)] ?? subject.label}
                      </div>
                      <div className="text-[11px] text-white/50">{subject.role}</div>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${
                      index === 0
                        ? "bg-primary/10 text-primary border border-primary/40"
                        : "bg-blue-500/10 text-blue-200 border border-blue-500/40"
                    }`}
                  >
                    Risk {index === 0 ? "High" : "Critical"}
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Name Override
                  </div>
                  <input
                    value={personNames[String(index)] ?? ""}
                    onChange={(event) => updatePersonName(index, event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-primary/60"
                    placeholder={`Person ${index + 1}`}
                  />
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Signal Radar
                  </div>
                  <div className="relative mt-3 h-36 rounded-2xl border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.04),rgba(0,0,0,0.4))]">
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="absolute inset-8 rounded-full border border-white/5" />
                    <div
                      className={`absolute inset-0 m-auto h-20 w-20 rounded-full ${
                        index === 0 ? "bg-primary/20" : "bg-blue-500/20"
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(index === 0 ? subjectA.metrics : subjectB.metrics)
                    .slice(0, 4)
                    .map(([label, value]) => (
                    <div
                      key={`arena-${index}-${label}`}
                      className="rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {label}
                      </div>
                      <div className="text-sm text-white/80 font-mono mt-1">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-5">
              <div className="rounded-3xl border border-white/10 bg-[#11131c]/90 p-6 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50 text-center">
                  Global Mismatch Score
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative h-44 w-44">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(#2563eb_0deg,#2563eb_270deg,rgba(255,255,255,0.08)_270deg)]" />
                    <div className="absolute inset-3 rounded-full bg-[#0c0d12] border border-white/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-semibold">74%</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">
                          Divergence
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-white/60">
                    Primary breach at 03:00 · overlays synced
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
                    <div className="text-white/40">Voice Analysis</div>
                    <div className="text-blue-200 mt-1">Low Match</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
                    <div className="text-white/40">Micro-Expressions</div>
                    <div className="text-blue-200 mt-1">Med Match</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#11131c]/90 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Interrogative Synthesis
                </div>
                <div className="mt-4 text-sm text-white/70 leading-relaxed">
                  Comparative analysis reveals significant divergence during the
                  enforcement segment (02:50 → 03:10). Subject B maintains
                  composure until a sharp vocal instability event at 03:00,
                  while Subject A displays consistent low-level stress markers
                  without breach.
                </div>
                <div className="mt-4 text-xs text-white/50">
                  Recommendation: Prioritize overlay review on vocal + posture
                  channels for Subject B.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#11131c]/85 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">
                Key Divergence Metrics
              </div>
              <div className="mt-4 space-y-3">
                {divergenceMetrics.length === 0 && <EmptyState />}
                {divergenceMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{metric.label}</span>
                      <span className="text-xs text-primary">{metric.delta}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                        <span className="text-white/40">A</span>
                        <div className="text-white/80 font-mono mt-1">{metric.a}</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                        <span className="text-white/40">B</span>
                        <div className="text-white/80 font-mono mt-1">{metric.b}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Severity: <span className="text-primary">{metric.severity}</span>
                    </div>
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
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${chatExpanded ? "pt-4" : "pt-2"}`}>
          <div
            className={`transition-all duration-300 ${
              chatExpanded ? "max-h-[420px]" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="flex flex-col gap-3 pb-4 max-h-[380px] overflow-y-auto pr-2">
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

                if ("comparison" in msg) {
                  return (
                    <div
                      key={`ai-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#141621] p-4"
                    >
                      <div className="text-sm font-semibold">{msg.title}</div>
                      {comparisonCards}
                      <div className="mt-4 text-sm text-white/60 border-t border-white/5 pt-3">
                        {msg.summary}
                      </div>
                    </div>
                  );
                }

                if ("groups" in msg) {
                  return (
                    <div
                      key={`ai-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#141621] p-4"
                    >
                      <div className="text-sm font-semibold">{msg.title}</div>
                      <div className="mt-3 space-y-4">
                        {msg.groups.map((group) => (
                          <div key={group.label} className="rounded-xl border border-white/10 bg-black/30 p-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                              {group.label}
                            </div>
                            <div className="mt-3 space-y-2">
                              {group.items.map((item) => (
                                <button
                                  key={`${item.text}-${item.time}`}
                                  onClick={() => handleJump(item.time)}
                                  className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left hover:border-primary/40"
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
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-white/60 border-t border-white/5 pt-3">
                        {msg.summary}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`ai-${index}`}
                    className="rounded-2xl border border-white/10 bg-[#141621] p-4"
                  >
                    {msg.title && <div className="text-sm font-semibold">{msg.title}</div>}
                    {"note" in msg && msg.note && (
                      <div className="mt-2 text-xs text-white/50">{msg.note}</div>
                    )}
                    <div className="mt-3 space-y-2">
                      {msg.items.map((item) => (
                        <button
                          key={`${item.text}-${item.time}`}
                          onClick={() => handleJump(item.time)}
                          className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left hover:border-primary/40 hover:shadow-[0_0_16px_rgba(236,91,19,0.25)]"
                        >
                          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-sm">{item.icon}</span>
                          </div>
                          <div className="text-sm text-white/70 flex-1">
                            {item.text}
                          </div>
                          {item.tag && (
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 border border-white/10 rounded-full px-2 py-1">
                              Candidate {item.tag}
                            </div>
                          )}
                          <div className="text-xs text-primary font-mono">
                            {item.time}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-white/60 border-t border-white/5 pt-3">
                      {msg.summary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isTyping && (
            <div className="max-w-7xl mx-auto">
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

          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.length === 0 && <EmptyState />}
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.key}
                onClick={() => handlePrompt(prompt.key)}
                className={`rounded-full border px-4 py-2 text-xs transition-all hover:shadow-[0_0_18px_rgba(236,91,19,0.35)] ${
                  prompt.key === activePanel
                    ? "border-primary/60 text-white bg-primary/10"
                    : "border-white/10 text-white/60 hover:text-white hover:border-primary/40"
                }`}
              >
                {prompt.label}
              </button>
            ))}
          </div>
          {jumpTo && (
            <div className="mt-2 text-xs text-primary/90">
              Queued jump marker: {jumpTo}
            </div>
          )}

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
              placeholder="Ask anything about this video..."
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
