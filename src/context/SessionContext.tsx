import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SessionStatus =
  | "idle"
  | "uploading"
  | "queued"
  | "processing"
  | "complete"
  | "failed";

export type SessionState = {
  jobId: string | null;
  sessionId: string | null;
  status: SessionStatus;
  error: string | null;
  results: unknown | null;
  lastUploadName: string | null;
  apiBase: string;
  startAnalyze: (file: File, preset: string) => Promise<string | null>;
  pollStatus: () => Promise<void>;
  fetchResults: () => Promise<void>;
  setSessionId: (sessionId: string | null) => void;
  setJobId: (jobId: string | null) => void;
  getPersonNamesForSession: (sessionId: string) => Record<string, string>;
  savePersonNamesForSession: (
    sessionId: string,
    personNames: Record<string, string>,
  ) => void;
};

const SessionContext = createContext<SessionState | null>(null);
const PERSON_NAMES_STORAGE_KEY = "opm_person_names_by_session";

function readPersonNamesStore() {
  try {
    const raw = window.localStorage.getItem(PERSON_NAMES_STORAGE_KEY);
    if (!raw) return {} as Record<string, Record<string, string>>;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {} as Record<string, Record<string, string>>;
    }
    return parsed as Record<string, Record<string, string>>;
  } catch {
    return {} as Record<string, Record<string, string>>;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const apiBase = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/$/, "");
  const [jobId, setJobId] = useState<string | null>(
    window.localStorage.getItem("opm_job_id") || null,
  );
  const [sessionId, setSessionIdState] = useState<string | null>(
    window.localStorage.getItem("opm_session_id") || null,
  );
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<unknown | null>(null);
  const [lastUploadName, setLastUploadName] = useState<string | null>(
    window.localStorage.getItem("opm_last_upload") || null,
  );

  const setSessionId = (next: string | null) => {
    setSessionIdState(next);
    if (next) {
      window.localStorage.setItem("opm_session_id", next);
    } else {
      window.localStorage.removeItem("opm_session_id");
    }
  };

  const setJobIdSafe = (next: string | null) => {
    setJobId(next);
    if (next) {
      window.localStorage.setItem("opm_job_id", next);
    } else {
      window.localStorage.removeItem("opm_job_id");
    }
  };

  const getPersonNamesForSession = (targetSessionId: string) => {
    const store = readPersonNamesStore();
    return store[targetSessionId] ?? {};
  };

  const savePersonNamesForSession = (
    targetSessionId: string,
    personNames: Record<string, string>,
  ) => {
    const store = readPersonNamesStore();
    const cleaned = Object.fromEntries(
      Object.entries(personNames).filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0,
      ),
    );
    store[targetSessionId] = cleaned;
    window.localStorage.setItem(PERSON_NAMES_STORAGE_KEY, JSON.stringify(store));
  };

  const startAnalyze = async (file: File, preset: string) => {
    setError(null);
    setStatus("uploading");
    setLastUploadName(file.name);
    window.localStorage.setItem("opm_last_upload", file.name);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("preset", preset);

    try {
      const response = await fetch(`${apiBase}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }
      const data = await response.json();
      const nextJob = data?.job_id as string | undefined;
      if (!nextJob) {
        throw new Error("No job_id returned from server");
      }
      setJobIdSafe(nextJob);
      setStatus(data?.status ?? "queued");
      return nextJob;
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    }
  };

  const pollStatus = async () => {
    if (!jobId) return;
    try {
      const response = await fetch(`${apiBase}/status/${jobId}`);
      if (!response.ok) return;
      const data = await response.json();
      const nextStatus = data?.status as SessionStatus | undefined;
      if (nextStatus) {
        setStatus(nextStatus);
      }
      if (data?.session_id) {
        setSessionId(data.session_id);
      }
      if (nextStatus === "failed") {
        setError(data?.error ?? "Processing failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status check failed");
    }
  };

  const fetchResults = async () => {
    if (!jobId) return;
    try {
      const response = await fetch(`${apiBase}/results/${jobId}`);
      if (!response.ok) return;
      const data = await response.json();
      setResults(data);
      if (data?.session_id) {
        setSessionId(data.session_id);
      }
      setStatus("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Results fetch failed");
    }
  };

  const value = useMemo(
    () => ({
      jobId,
      sessionId,
      status,
      error,
      results,
      lastUploadName,
      apiBase,
      startAnalyze,
      pollStatus,
      fetchResults,
      setSessionId,
      setJobId: setJobIdSafe,
      getPersonNamesForSession,
      savePersonNamesForSession,
    }),
    [jobId, sessionId, status, error, results, lastUploadName, apiBase],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
