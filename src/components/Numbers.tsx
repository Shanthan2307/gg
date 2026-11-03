"use client";

import { numbers } from "@/content";
import { Odometer } from "./ui";

export default function Numbers() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="card grid grid-cols-2 divide-line p-2 sm:grid-cols-3 lg:grid-cols-6">
        {numbers.map((n) => (
          <div key={n.label} className="px-4 py-5">
            <div className="font-display text-4xl leading-none">
              <Odometer value={n.value} decimals={n.decimals} prefix={n.prefix} suffix={n.suffix} />
            </div>
            <p className="mt-2 text-xs leading-snug text-muted">{n.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
