export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_38%)]" />
      <div className="absolute left-[-12%] top-[-10%] h-[24rem] w-[24rem] rounded-full bg-sky-400/20 blur-3xl animate-orbit-slow sm:h-[32rem] sm:w-[32rem]" />
      <div className="absolute right-[-8%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-emerald-400/20 blur-3xl animate-orbit-reverse sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute bottom-[-16%] left-[20%] h-[18rem] w-[18rem] rounded-full bg-cyan-300/20 blur-3xl animate-orbit-slow sm:h-[26rem] sm:w-[26rem]" />

      <div className="absolute inset-x-0 top-[12%] h-px bg-gradient-to-r from-transparent via-slate-400/25 to-transparent animate-drift-right" />
      <div className="absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent animate-drift-left" />
      <div className="absolute inset-y-0 left-[18%] w-px bg-gradient-to-b from-transparent via-white/50 to-transparent animate-drift-down" />
      <div className="absolute inset-y-0 right-[16%] w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-drift-up" />

      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:5.5rem_5.5rem] sm:[background-size:7rem_7rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.15)_48%,rgba(248,250,252,0.6)_100%)]" />
    </div>
  );
}
