export default function AnalysisCompleteScreen() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen overflow-hidden font-display">
      <div className="fixed inset-0 z-0 bg-cinematic">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZsSwSUkMNR-rU4Dk7_Gs8YsL4dNQxMH9e7C6WiiU_vZSgqpeoEl6DMrmzRIYBeeTpsifqKPd2ZTG5Y80wsKsfS-jw8JxLS3Ii5CmOz4np-MI98ASnwEcIQ8-qHcFQedBidXwkA-s8qNqQtehwVPERmVxorUbVjdCa1XackdrN_rYs3917teWdqPcgLloZcdY1COOJfSpWVliuf_CAZUBT9XU1POy3G9BhAfiGhFhKjtCuETYohgLbYtw44UWozjH_IuFrf5Qu8bg')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white text-2xl">
                  visibility
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Perception <span className="text-primary">AI</span>
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/20 shadow-lg">
                <img
                  alt="Thumbnail of analyzed video"
                  className="w-full h-full object-cover grayscale opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1ZcCKLLOGTkalfEjp2ZdAI7nPQAKbSDbgXMPPTghNqjggxOrgEO8Ch_exf7Pgrh60dBCR6aDEf78lM8WvlOQUJrJ4WcsyL-zol1Ic9EhDmwUmYDdeYWP_0BEkEDNknF1ObIEaNUsWl3T5rWckxx-acRF0XqmLj6GISE2SuqLHg_tuuysLKalioNFwpUIrghs_4A6NozUdvfqGzGAqhHGPWv6Tg0Q0NZE8m-LwXWY8WodZ6KhrsVa30JtOWrUA0o00xKTs0C9EZLA"
                />
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                Analyzed: <span className="text-white/80">Project_Alpha_V4</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl glass-card text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl glass-card text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-primary/40 p-0.5">
              <img
                alt="User profile"
                className="w-full h-full rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZC-6N-Vo0IJe5j7JEDdJnluxg03o8Z0YnX2ZVIKsaz6LPqWTQc2u-y7eKl4guT5VjpfItREIud26NB_91MENlfva95CXM6uAXPfADTc0sIA9UUmAosokmZ-Wo6FU0abdyaEMXOkHRxJCdaJKJkSJdtlYHB_jFcegPHL3YEQvrCQYjhvaUyzTpsrxoFpqX-Kb4AWQTFjUoTlNEEznQEJtsO4B0wnCIsG4hvZz0uuN92jO-5KsdLtfqtUpSS9TM2Z_nPEgmgMLo-d8"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-10 sm:pb-12">
          <div className="max-w-2xl w-full glass-card rounded-xl p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="mb-6 sm:mb-8 relative">
              <div className="success-pulse w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                  <span className="material-symbols-outlined text-white text-3xl font-bold">
                    check
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-white">
              Analysis Complete
            </h1>
            <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-10 max-w-md">
              12 key behavioral insights detected across{" "}
              <span className="text-white font-medium">04:22:14</span> of footage.
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
              <div className="glass-card rounded-lg p-5 border-l-2 border-green-500/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
                  Dominant Emotion
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-lg font-semibold text-white">
                    Gratitude
                  </span>
                </div>
              </div>
              <div className="glass-card rounded-lg p-5 border-l-2 border-primary/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
                  Confidence Score
                </span>
                <span className="text-lg font-semibold text-white">94.2%</span>
              </div>
              <div className="glass-card rounded-lg p-5 border-l-2 border-blue-500/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
                  Anomalies
                </span>
                <span className="text-lg font-semibold text-white">
                  3 Divergences
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-5 sm:gap-6">
              <button className="w-full py-3.5 sm:py-4 bg-primary hover:bg-primary/90 rounded-lg text-white font-bold text-base sm:text-lg transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                View Full Report
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="text-white/50 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  video_library
                </span>
                Analyze Another Video
              </button>
            </div>
          </div>
        </main>

        <footer className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              <span>Processing Engine: V3.4.1</span>
              <span>Server: US-EAST-NODE-04</span>
              <span>Uptime: 99.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              System Online
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
