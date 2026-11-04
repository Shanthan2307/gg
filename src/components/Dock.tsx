"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { setMode, useMode } from "./theme";

const items = [
  { href: "#top", label: "Home", icon: "⌂" },
  { href: "#tickets", label: "Hackathons", icon: "✦" },
  { href: "#receipts", label: "Internships", icon: "≡" },
  { href: "#lab", label: "Research", icon: "⚗" },
  { href: "#passport", label: "Campus", icon: "✈" },
  { href: "#hand", label: "Honors", icon: "♠" },
  { href: "#contact", label: "Contact", icon: "✉" },
];

function DockIcon({ mouseX, children, label, href, onClick }: { mouseX: MotionValue<number>; children: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : 999;
  });
  const size = useSpring(useTransform(dist, [-110, 0, 110], [36, 52, 36]), { stiffness: 300, damping: 22 });
  const className =
    "group relative flex cursor-pointer items-center justify-center rounded-xl text-[15px] text-white/80 hover:bg-white/10 hover:text-white";
  const inner = (
    <>
      {children}
      <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-[#1b1a18] px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </>
  );
  // links navigate; the mode toggle is a real button so keyboards can reach it
  return href ? (
    <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} aria-label={label} style={{ width: size, height: size }} className={className}>
      {inner}
    </motion.a>
  ) : (
    <motion.button ref={ref as React.RefObject<HTMLButtonElement>} type="button" onClick={onClick} aria-label={label} style={{ width: size, height: size }} className={className}>
      {inner}
    </motion.button>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const mode = useMode();
  const toggle = () => setMode(mode === "blossom" ? "matcha" : "blossom");
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-14 items-end gap-1 rounded-2xl border border-white/10 bg-[#262422]/95 px-2 pb-[10px] shadow-xl backdrop-blur"
      >
        {items.map((it) => (
          <DockIcon key={it.href} mouseX={mouseX} label={it.label} href={it.href}>
            {it.icon}
          </DockIcon>
        ))}
        <span className="mx-1 mb-2 h-5 w-px bg-white/15" />
        {/* shows the mode you switch to */}
        <DockIcon mouseX={mouseX} label={mode === "blossom" ? "Matcha mode" : "Cherry blossom mode"} onClick={toggle}>
          <span aria-hidden>{mode === "blossom" ? "🍵" : "🌸"}</span>
        </DockIcon>
      </div>
    </nav>
  );
}
