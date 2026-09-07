"use client";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Blob 1 */}
      <div className="absolute left-10 top-20 h-80 w-80 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Blob 2 */}
      <div className="absolute right-20 top-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />

      {/* Blob 3 */}
      <div className="absolute bottom-10 left-1/3 h-80 w-80 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />

    </div>
  );
}