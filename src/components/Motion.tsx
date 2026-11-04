"use client";

import { MotionConfig } from "framer-motion";

/* Framer animations honor the visitor's reduced-motion setting site-wide */
export default function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
