import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lost ticket · The Build Log",
  description: "This page isn't in Gargi Pathak's build log.",
};

/* 404: a ticket stub that was never issued */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh items-center justify-center px-4 py-16">
      <article className="ticket card relative flex w-full max-w-[560px] flex-col sm:flex-row">
        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Admit nobody · No. 404</p>
          <h1 className="mt-4 font-display text-5xl leading-none">Lost ticket</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            This page was never printed. The rest of the log is still where she left it.
          </p>
          <Link
            href="/"
            className="press mt-6 inline-flex w-fit items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm"
          >
            Back to the log <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mx-6 border-t-2 border-dashed border-line sm:mx-0 sm:my-6 sm:border-l-2 sm:border-t-0" />
        <div className="flex items-center justify-center p-6 sm:w-[160px]">
          <div
            className="flex h-[96px] w-[96px] -rotate-12 flex-col items-center justify-center rounded-full border-[3px] border-double border-accent font-mono uppercase text-accent"
            aria-hidden
          >
            <span className="text-[11px] font-bold tracking-[0.18em]">Void</span>
            <span className="mt-0.5 text-[8px] tracking-widest">not issued</span>
          </div>
        </div>
      </article>
    </main>
  );
}
