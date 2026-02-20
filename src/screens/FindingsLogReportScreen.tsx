export default function FindingsLogReportScreen() {
  const findings = [
    {
      id: "CAM_01",
      time: "00:04:15.12",
      type: "Micro-Expression",
      title: "Suppressed Anger Response",
      desc:
        "Rapid contraction of the orbicularis oculi coupled with lip compression. Subject attempts to mask reaction to keyword “Funding Source”.",
      stats: ["Voice Pitch 124Hz (Normal)", "Gaze Direct (-2° dev)", "Analysis: 81%"],
      confidence: 94,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "CAM_01",
      time: "00:08:22.05",
      type: "Behavioral Mismatch",
      title: "Verbal–Nonverbal Contradiction",
      desc:
        "Subject verbally states “Full cooperation” while adopting a closed, defensive posture (crossed arms, leaning back). Shoulders elevated indicating stress.",
      stats: ["Spoken Sentiment +0.8", "Body Language -0.6", "Priority: High"],
      confidence: 88,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      highlight: true,
    },
    {
      id: "CAM_02",
      time: "00:12:45.09",
      type: "Ocular Response",
      title: "Lateral Eye Movement",
      desc:
        "Subject’s gaze shifts rapidly to the upper right quadrant during recall, suggesting constructed visual imagery rather than memory access.",
      stats: ["Pupil Dilation 4.2mm (+10%)", "Duration 1.2s", "Analysis: 76%"],
      confidence: 76,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "MIC_A",
      time: "00:18:22.00",
      type: "Vocal Stress",
      title: "Pitch Anomaly",
      desc:
        "Sudden increase in vocal pitch combined with hesitation markers (“uh”, “um”). Detected during answer regarding “Known Associates”.",
      stats: ["Frequency 185Hz (+45Hz)", "Jitter 2.4%", "Analysis: 82%"],
      confidence: 82,
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "CAM_03",
      time: "00:27:31.44",
      type: "Tension Spike",
      title: "Self-touch Cluster",
      desc:
        "Repeated self-touching at the collar and jawline coincides with elevated heart rate and micro-tremor in hands.",
      stats: ["HR 102 (+12)", "Hand Tremor +0.7", "Analysis: 69%"],
      confidence: 69,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#221e10] text-gray-100 font-display">
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #221e10; }
        ::-webkit-scrollbar-thumb { background: #3f3a2b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #f2b90d; }
      `}</style>

      <div className="w-full bg-[#2a2515] border-b border-primary/30 py-2 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] text-primary/80 uppercase">
          Confidential Intelligence Report // Do Not Distribute
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8 border-b border-primary/40 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                DETAILED
                <span className="block text-primary">FINDINGS LOG</span>
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-primary text-black text-xs font-bold uppercase">
                  Classified
                </span>
                <span className="text-sm text-primary/70">Ref: #SR-9942-AX</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-300">
              <div>
                <div className="text-xs text-primary/60 uppercase tracking-wider">Subject</div>
                <div className="font-medium">ALEXEI VOLKOV</div>
              </div>
              <div>
                <div className="text-xs text-primary/60 uppercase tracking-wider">Date</div>
                <div className="font-medium">OCT 24, 2023</div>
              </div>
              <div>
                <div className="text-xs text-primary/60 uppercase tracking-wider">Analyst ID</div>
                <div className="font-medium">UNIT-04 (AUTO)</div>
              </div>
              <div>
                <div className="text-xs text-primary/60 uppercase tracking-wider">Duration</div>
                <div className="font-medium">42m 15s</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-8 bg-[#2a2515] border border-primary/20 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 mr-4 text-xs text-primary/70 uppercase tracking-wider">
            <span className="material-icons text-primary text-lg">filter_list</span>
            Filter View:
          </div>
          <button className="px-3 py-1.5 rounded bg-primary text-black text-xs font-bold uppercase">All Events</button>
          <button className="px-3 py-1.5 rounded border border-white/20 text-gray-200 text-xs font-bold uppercase hover:border-primary">Emotions</button>
          <button className="px-3 py-1.5 rounded border border-white/20 text-gray-200 text-xs font-bold uppercase hover:border-primary">Micro-Expressions</button>
          <button className="px-3 py-1.5 rounded border border-primary/50 text-primary text-xs font-bold uppercase flex items-center gap-2 hover:bg-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Conflicts Detected (2)
          </button>
          <div className="ml-auto text-xs text-primary/60 font-mono">Scan completion: 100%</div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {findings.map((item) => (
            <article
              key={`${item.title}-${item.time}`}
              className={`rounded-2xl border ${
                item.highlight ? "border-primary/60" : "border-white/10"
              } bg-[#2a2515]/80 overflow-hidden shadow-lg`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-56 h-48 md:h-auto relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-primary text-[10px] font-mono px-2 py-1 rounded border border-primary/30">
                    {item.id}
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3 text-xs text-primary/80 uppercase tracking-widest">
                    <span className="px-2 py-1 rounded bg-primary/10 border border-primary/30">
                      {item.time}
                    </span>
                    <span>{item.type}</span>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold text-primary">{item.confidence}%</div>
                      <div className="text-[10px] text-primary/60">Confidence</div>
                    </div>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-primary/70">
                    {item.stats.map((stat) => (
                      <div key={stat} className="bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-primary/60">
          <div className="uppercase tracking-[0.3em]">Confidential // For internal use only</div>
          <div className="flex items-center gap-3">
            <button className="h-8 w-8 rounded border border-primary/30">‹</button>
            <span className="font-mono">Page 1 of 4</span>
            <button className="h-8 w-8 rounded border border-primary/30">›</button>
          </div>
        </div>
      </main>
    </div>
  );
}
