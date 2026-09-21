"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          href="#about"
          data-cursor="UP"
          aria-label="Back to top"
          className="focus-ring fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/85 text-ink shadow-lg backdrop-blur transition-colors hover:border-accent hover:text-accent sm:flex"
        >
          ↑
        </motion.a>
      )}
    </AnimatePresence>
  );
}
