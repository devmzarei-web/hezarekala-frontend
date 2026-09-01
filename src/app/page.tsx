"use client";

import { useEffect, useState } from "react";

export default function IntroPage() {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "zoom">("typing");
  const fullText = "هزاره کالا دانش اروند";

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("intro-played") === "true") {
      window.location.replace("/home");
    }
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    let i = 0;

    const interval = window.setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;

      if (i >= fullText.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setPhase("zoom"), 600);
      }
    }, 70);

    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "zoom") return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("intro-played", "true");
      window.location.replace("/home");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#060f1c] transition-all duration-700 opacity-100"
      dir="rtl"
    >
      <div
        className={`relative transition-all duration-[1.5s] ease-in-out ${
          phase === "zoom" ? "scale-[8] opacity-0 blur-md" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl xl:text-[11rem] font-black text-center whitespace-nowrap tracking-[0.02em] select-none"
          style={{
            fontFamily: "'B Titr', 'YekanBakh', sans-serif",
            backgroundImage: "url('/images/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.35)",
            filter:
              "drop-shadow(0 8px 20px rgba(0,0,0,0.9)) drop-shadow(0 2px 6px rgba(196,154,44,0.3))",
          }}
        >
          {displayText}
          {phase === "typing" && (
            <span
              className="inline-block w-[4px] h-[0.8em] ml-1 animate-pulse align-middle rounded-full"
              style={{
                backgroundColor: "#c49a2c",
                WebkitTextFillColor: "initial",
                WebkitTextStroke: "0",
                color: "#c49a2c",
                filter: "drop-shadow(0 0 10px rgba(196,154,44,0.8))",
              }}
            />
          )}
        </h1>
      </div>
    </div>
  );
}