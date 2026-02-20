import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";

type StageStatus = "completed" | "active" | "pending";

type Stage = {
  id: string;
  title: string;
  icon: string;
};

const STAGES: Stage[] = [
  { id: "signal", title: "Signal Extraction", icon: "waves" },
  { id: "deep", title: "Deep Analysis", icon: "psychology" },
  { id: "pattern", title: "Pattern Recognition", icon: "hub" },
  { id: "interpret", title: "Interpretation", icon: "lightbulb" },
  { id: "final", title: "Finalization", icon: "done_all" },
];

const STAGE_DURATIONS_SEC = [12, 18, 16, 14, 10];

type AnomalyTile = {
  id: number;
  isAnomaly: boolean;
  found: boolean;
};

const ANOMALY_GRID_COLS = 6;
const ANOMALY_GRID_ROWS = 4;
const ANOMALY_GRID_COUNT = ANOMALY_GRID_COLS * ANOMALY_GRID_ROWS;
type DifficultyKey = "easy" | "medium" | "hard";

const DIFFICULTY: Record<
  DifficultyKey,
  { anomalies: number; time: number; label: string }
> = {
  easy: { anomalies: 6, time: 15, label: "Easy" },
  medium: { anomalies: 7, time: 15, label: "Medium" },
  hard: { anomalies: 8, time: 12, label: "Hard" },
};

function getLevelConfig(level: number, difficulty: DifficultyKey) {
  const base = DIFFICULTY[difficulty];
  const anomalyBoost = Math.floor((level - 1) / 2);
  const anomalies = Math.min(base.anomalies + anomalyBoost, 10);
  const time = Math.max(base.time - (level - 1), 8);
  return { anomalies, time };
}

function generateAnomalyTiles(anomalyCount: number): AnomalyTile[] {
  const tiles: AnomalyTile[] = Array.from(
    { length: ANOMALY_GRID_COUNT },
    (_, index) => ({ id: index, isAnomaly: false, found: false })
  );
  const anomalyIndices = new Set<number>();
  while (anomalyIndices.size < anomalyCount) {
    anomalyIndices.add(Math.floor(Math.random() * ANOMALY_GRID_COUNT));
  }
  anomalyIndices.forEach((index) => {
    tiles[index].isAnomaly = true;
  });
  return tiles;
}

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export default function ProcessingAnalysisScreen() {
  const { jobId, status, pollStatus, fetchResults } = useSession();
  const navigate = useNavigate();
  const [serverElapsed, setServerElapsed] = useState<number | null>(null);
  const totalDuration = STAGE_DURATIONS_SEC.reduce((a, b) => a + b, 0);
  const totalMs = totalDuration * 1000;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [difficulty, setDifficulty] = useState<DifficultyKey>("medium");
  const [showIntro, setShowIntro] = useState(true);
  const [roundResult, setRoundResult] = useState<
    "idle" | "success" | "fail"
  >("idle");
  const [roundMessage, setRoundMessage] = useState("");
  const [level, setLevel] = useState(1);
  const [tiles, setTiles] = useState<AnomalyTile[]>(() =>
    generateAnomalyTiles(DIFFICULTY.medium.anomalies)
  );
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(DIFFICULTY.medium.time);
  const [gameFlash, setGameFlash] = useState(false);
  const [gameMiss, setGameMiss] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const interval = window.setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 250;
        if (next >= totalMs) {
          setIsComplete(true);
          return totalMs;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(interval);
  }, [totalMs, jobId]);


  useEffect(() => {
    if (!jobId) return;
    const interval = window.setInterval(() => {
      void pollStatus();
    }, 2000);
    return () => window.clearInterval(interval);
  }, [jobId, pollStatus]);

  useEffect(() => {
    if (!jobId) return;
    if (status !== "complete") return;
    void fetchResults().then(() => {
      setIsComplete(true);
      setElapsedMs(totalMs);
    });
  }, [status, jobId, fetchResults, totalMs]);

  useEffect(() => {
    if (!jobId) return;
    let ignore = false;
    const loadStatus = async () => {
      try {
        const base = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/$/, "");
        const response = await fetch(`${base}/status/${jobId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (ignore) return;
        if (typeof data?.elapsed_sec === "number") {
          setServerElapsed(data.elapsed_sec);
        }
      } catch {
        // ignore
      }
    };
    loadStatus();
    const interval = window.setInterval(loadStatus, 2000);
    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [jobId]);

  useEffect(() => {
    if (!isComplete) return;
    const timeout = window.setTimeout(() => {
      navigate("/analysis");
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [isComplete]);

  const timelineElapsedSec = useMemo(() => {
    if (serverElapsed !== null) {
      return Math.min(Math.max(serverElapsed, 0), totalDuration);
    }
    return Math.min(elapsedMs / 1000, totalDuration);
  }, [elapsedMs, serverElapsed, totalDuration]);
  const progress = useMemo(
    () => Math.min(timelineElapsedSec / totalDuration, 1),
    [timelineElapsedSec, totalDuration],
  );

  let cumulative = 0;
  let activeIndex = 0;
  let activeElapsed = timelineElapsedSec;
  for (let i = 0; i < STAGE_DURATIONS_SEC.length; i += 1) {
    const duration = STAGE_DURATIONS_SEC[i];
    if (timelineElapsedSec < cumulative + duration) {
      activeIndex = i;
      activeElapsed = timelineElapsedSec - cumulative;
      break;
    }
    cumulative += duration;
    if (i === STAGE_DURATIONS_SEC.length - 1) {
      activeIndex = i;
      activeElapsed = duration;
    }
  }

  const remainingSec = Math.max(0, totalDuration - timelineElapsedSec);

  const levelConfig = useMemo(
    () => getLevelConfig(level, difficulty),
    [difficulty, level]
  );

  useEffect(() => {
    if (showIntro || roundResult !== "idle") return;
    const interval = window.setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          setRoundMessage("Time’s up. Run it back.");
          setRoundResult("fail");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [difficulty, roundResult, showIntro]);

  useEffect(() => {
    if (showIntro || roundResult !== "idle" || !soundOn) return;
    if (gameTime <= 0) return;
    const audio = audioRef.current;
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.05);
  }, [gameTime, roundResult, showIntro, soundOn]);

  useEffect(() => {
    const foundCount = tiles.filter((tile) => tile.isAnomaly && tile.found)
      .length;
    if (foundCount < levelConfig.anomalies) return;
    setGameFlash(true);
    setGameScore((prev) => prev + 1);
    const timeout = window.setTimeout(() => {
      setRoundMessage(`Level ${level + 1} incoming.`);
      setRoundResult("success");
      setGameFlash(false);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [level, levelConfig.anomalies, tiles]);

  const handleTileClick = (index: number) => {
    if (showIntro || roundResult !== "idle") return;
    setTiles((prev) =>
      prev.map((tile) => {
        if (tile.id !== index || tile.found) return tile;
        if (tile.isAnomaly) return { ...tile, found: true };
        return tile;
      })
    );
    if (!tiles[index]?.isAnomaly && !tiles[index]?.found) {
      setGameMiss(true);
      setGameTime((prev) => Math.max(0, prev - 2));
      window.setTimeout(() => setGameMiss(false), 200);
    }
  };

  const foundCount = tiles.filter((tile) => tile.isAnomaly && tile.found).length;
  const remainingAnomalies = levelConfig.anomalies - foundCount;
  const timePct = Math.max(
    0,
    Math.min(100, (gameTime / levelConfig.time) * 100)
  );

  const resetRound = (nextLevel = level) => {
    const nextConfig = getLevelConfig(nextLevel, difficulty);
    setTiles(generateAnomalyTiles(nextConfig.anomalies));
    setGameTime(nextConfig.time);
    setLevel(nextLevel);
    setRoundResult("idle");
  };

  useEffect(() => {
    if (roundResult !== "success") return;
    const timeout = window.setTimeout(() => {
      resetRound(level + 1);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [level, roundResult]);
  return (
    <div className="bg-[#160d09] text-slate-200 min-h-screen overflow-hidden font-display relative">
      {isComplete && <div className="completion-wipe" />}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined text-2xl">
                analytics
              </span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                Deep Analysis Engine
              </h1>
              <p className="text-[10px] sm:text-xs text-primary font-medium tracking-widest opacity-80">
                Neural Core v4.2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase tracking-tighter">
                System Load
              </span>
              <span className="text-sm font-bold text-white">84% CPU</span>
            </div>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-panel-dark flex items-center justify-center border-glass-border hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-white">
                settings
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 relative">
          <div className="hidden lg:block absolute top-0 left-8 group">
            <div className="relative w-64 aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl glass-panel-dark group-hover:scale-105 transition-transform duration-500 float-slow">
              <img
                className="w-full h-full object-cover opacity-60"
                alt="Processing video thumbnail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo2y5YW07T-r7t1IiGDk3pO_GLw5gDMXYb89uu_zqyfkhO20HVot6wgunkIkQVzS7WLxJUtE-AdJSgEJ14HQ2ezKYUEn9-wWqzli2gz4tQD7S2UoJnj0GVjKYNAJWn91lp4f32eGP0QNk9kX6oxSKK41JVtKccNvtHPUvoz4wY0ueLI7zXF37zvak4loM80pXcJueP3oSkWjGdlKOZSRgc9b5v8zlfK0K4IVtCRwjNK16wRhv7U-4pr1T701jwlzhuRakB4UWcpMI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160d09]/80 to-transparent" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-primary/40 shadow-[0_0_10px_#ec5b13] shimmer" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                  Processing
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-white/90">
                project_alpha_render.mp4
              </p>
              <p className="text-[10px] text-white/40 tracking-wider">
                H.264 • 4K • 24fps
              </p>
            </div>
          </div>

          <div className="w-full max-w-lg flex flex-col items-center">
            {STAGES.map((stage, index) => {
              const status: StageStatus =
                index < activeIndex
                  ? "completed"
                  : index === activeIndex
                    ? "active"
                    : "pending";

              const isActive = status === "active";
              const isCompleted = status === "completed";
              const stageDuration = STAGE_DURATIONS_SEC[index];
              const stageProgress = isActive
                ? Math.min(activeElapsed / stageDuration, 1)
                : isCompleted
                  ? 1
                  : 0;

              return (
                <div
                  key={stage.id}
                  className={`flex flex-col items-center w-full ${
                    status === "pending"
                      ? index === STAGES.length - 1
                        ? "opacity-20"
                        : "opacity-40"
                      : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-6 w-full ${
                      isActive ? "max-w-md p-6" : "max-w-sm p-4"
                    } glass-panel-dark rounded-xl border-white/5 ${
                      isActive
                        ? "border-primary/40 glow-active bg-primary/5 ring-1 ring-primary/20 stage-active"
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        isActive ? "w-14 h-14" : "w-12 h-12"
                      } rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500/20 text-green-400"
                          : isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-xl"
                            : "bg-white/10 text-white/60"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          isActive ? "text-3xl" : "text-2xl"
                        }`}
                      >
                        {stage.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`${
                            isActive
                              ? "text-base uppercase tracking-wide"
                              : "text-sm"
                          } font-bold text-white`}
                        >
                          {stage.title}
                        </h3>
                        {isActive && (
                          <span className="text-xs font-bold text-primary">
                            Stage {index + 1}/{STAGES.length}
                          </span>
                        )}
                      </div>
                      {isActive ? (
                        <>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-primary shadow-[0_0_10px_#ec5b13] processing-progress"
                              style={{ width: `${stageProgress * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-primary">
                              Neural mapping in progress...
                            </span>
                            <span className="text-white/50">
                              {formatTime(activeElapsed)} /{" "}
                              {formatTime(stageDuration)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p
                          className={`text-[11px] ${
                            isCompleted ? "text-green-400" : "text-white/40"
                          } font-medium`}
                        >
                          {isCompleted ? "Completed" : "Pending Queue"}
                        </p>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-green-400 text-xl">
                        check_circle
                      </span>
                    )}
                  </div>
                  {index < STAGES.length - 1 && (
                    <div
                      className={`w-0.5 ${
                        isCompleted ? "h-12 vertical-line-glow" : "h-8 vertical-line-dim"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <div className="inline-flex flex-col items-center">
              <p className="text-xs text-white/40 font-medium tracking-[0.3em] uppercase mb-1">
                Estimated time remaining
              </p>
              <h4 className="text-2xl sm:text-3xl font-light text-white tracking-widest font-mono">
                {formatTime(remainingSec)}
              </h4>
              {jobId && (
                <div className="mt-3 text-[11px] uppercase tracking-[0.3em] text-primary/80">
                  Status: {status}
                </div>
              )}
              {serverElapsed !== null && (
                <div className="mt-1 text-[10px] text-white/50">
                  Server elapsed: {formatTime(serverElapsed)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 w-full max-w-2xl">
            <div className="glass-panel-dark rounded-xl border border-white/5 p-4 sm:p-6 relative overflow-hidden">
              {gameFlash && <div className="absolute inset-0 lock-flash" />}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                    Anomaly Hunt
                  </p>
                  <p className="text-sm text-white/80">
                    Find the {levelConfig.anomalies} frames with micro-glitches
                    before time runs out.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/50">
                  <span>Level: {level}</span>
                  <span>Score: {gameScore}</span>
                  <span>Left: {remainingAnomalies}</span>
                  <span>{gameTime}s</span>
                </div>
              </div>

              {showIntro && (
                <div className="anomaly-intro">
                  <div className="anomaly-intro-card">
                    <h3 className="anomaly-intro-title">Spot the Glitches</h3>
                    <p className="anomaly-intro-copy">
                      Click the frames that feel “off” before the timer hits 0.
                      Each wrong click costs time.
                    </p>
                    <div className="anomaly-preview">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div
                          key={`preview-${index}`}
                          className={`anomaly-preview-tile ${
                            index === 3 || index === 8 ? "glitch" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <div className="anomaly-intro-options">
                      {(["easy", "medium", "hard"] as DifficultyKey[]).map(
                        (level) => (
                          <button
                            key={level}
                            className={`anomaly-chip ${
                              difficulty === level ? "active" : ""
                            }`}
                            onClick={() => setDifficulty(level)}
                          >
                            {DIFFICULTY[level].label}
                          </button>
                        )
                      )}
                    </div>
                    <div className="anomaly-intro-actions">
                      <button
                        className="anomaly-start"
                        onClick={() => {
                          if (!audioRef.current) {
                            audioRef.current = new AudioContext();
                          }
                        setLevel(1);
                        const baseConfig = getLevelConfig(1, difficulty);
                        setTiles(generateAnomalyTiles(baseConfig.anomalies));
                        setGameTime(baseConfig.time);
                        setGameScore(0);
                        setShowIntro(false);
                      }}
                    >
                        Start Game
                      </button>
                      <button
                        className={`anomaly-sound ${soundOn ? "on" : ""}`}
                        onClick={() => setSoundOn((prev) => !prev)}
                      >
                        {soundOn ? "Tick On" : "Tick Off"}
                      </button>
                    </div>
                    <p className="anomaly-intro-hint">
                      Tip: Look for subtle noise breaks.
                    </p>
                  </div>
                </div>
              )}

              {roundResult !== "idle" && (
                <div className="anomaly-intro">
                  <div className="anomaly-intro-card">
                    <h3 className="anomaly-intro-title">
                      {roundResult === "success" ? "Great Scan" : "Time’s Up"}
                    </h3>
                    <p className="anomaly-intro-copy">
                      {roundMessage}
                    </p>
                    <button
                      className="anomaly-start"
                      onClick={() =>
                        resetRound(roundResult === "success" ? level + 1 : 1)
                      }
                    >
                      {roundResult === "success" ? "Next Level" : "Try Again"}
                    </button>
                    <p className="anomaly-intro-hint">
                      Processing continues in the background.
                    </p>
                  </div>
                </div>
              )}

              <div className="anomaly-cta">
                <span className="anomaly-cta-text">Play while we process</span>
                <span className="anomaly-arrow" />
              </div>

              <div
                className={`anomaly-grid ${gameMiss ? "anomaly-miss" : ""} ${
                  showIntro || roundResult !== "idle" ? "anomaly-disabled" : ""
                }`}
              >
                {tiles.map((tile) => (
                  <button
                    key={tile.id}
                    className={`anomaly-tile ${
                      tile.isAnomaly ? "anomaly-hidden" : ""
                    } ${tile.found ? "anomaly-found" : ""}`}
                    onClick={() => handleTileClick(tile.id)}
                    aria-label="Anomaly tile"
                  />
                ))}
              </div>

              <div className="anomaly-meter">
                <div
                  className="anomaly-meter-fill"
                  style={{ width: `${timePct}%` }}
                />
              </div>
              <div className="anomaly-timer">Time left: {gameTime}s</div>
            </div>
          </div>
        </main>

        <footer className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                Global Progress
              </span>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                Active Thread
              </span>
              <span className="text-xs font-bold text-white mt-1">
                CORE_IDX_9281
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-lg glass-panel-dark text-white text-xs font-bold border-white/10 hover:bg-white/5 transition-all">
              Pause Engine
            </button>
            <button className="px-6 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">
              Terminate
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
