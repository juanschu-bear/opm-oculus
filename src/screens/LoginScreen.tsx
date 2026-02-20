import { useState } from "react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    window.localStorage.setItem("opm_auth_token", "demo-token");
    window.location.hash = "dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white font-display flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,91,19,0.15),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.12),transparent_40%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#11131c]/90 p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/90 flex items-center justify-center text-black">
            <span className="material-symbols-outlined">visibility</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">OPM</div>
            <div className="text-lg font-semibold">Perception Intelligence</div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-white/60">
          Access your analysis archive and active sessions.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/50">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/50">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-black py-3 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-white/50">
          <button className="hover:text-white">Forgot password?</button>
          <button
            className="hover:text-white"
            onClick={() => (window.location.hash = "register")}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
