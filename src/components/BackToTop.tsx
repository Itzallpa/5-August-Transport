"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to Top"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white flex items-center justify-center shadow-xl shadow-red-950/30 transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
