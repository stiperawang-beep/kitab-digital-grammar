"use client";

import { useState, useEffect, useRef } from "react";

export default function LampToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("kitab_lamp");
    if (saved === "true") {
      setOn(true);
      document.documentElement.setAttribute("data-lamp", "on");
    }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    localStorage.setItem("kitab_lamp", String(next));
    document.documentElement.setAttribute("data-lamp", next ? "on" : "off");

    // Subtle click sound using Web Audio
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(next ? 880 : 440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(next ? 1200 : 220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn off candlelight" : "Turn on candlelight"}
      className="lamp-toggle-btn"
      title={on ? "Padamkan Lampu" : "Nyalakan Lampu"}
    >
      {/* Bulb SVG */}
      <span className="lamp-bulb-wrap">
        <svg
          viewBox="0 0 60 80"
          className="lamp-bulb-svg"
          aria-hidden="true"
        >
          {/* Glow halo — only visible when ON */}
          <ellipse
            cx="30" cy="32" rx="28" ry="28"
            className="bulb-halo"
          />
          {/* Glass bulb */}
          <path
            d="M10,32 Q10,8 30,8 Q50,8 50,32 Q50,50 38,54 L38,60 Q38,62 36,62 L24,62 Q22,62 22,60 L22,54 Q10,50 10,32 Z"
            className="bulb-glass"
          />
          {/* Filament loop */}
          <path
            d="M26,48 Q26,42 30,38 Q34,42 34,48"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="bulb-filament"
          />
          {/* Base segments */}
          <rect x="22" y="62" width="16" height="4" rx="1" className="bulb-base" />
          <rect x="23" y="66" width="14" height="4" rx="1" className="bulb-base" />
          <rect x="24" y="70" width="12" height="3" rx="1" className="bulb-base" />
          {/* Shine glint */}
          <ellipse cx="20" cy="22" rx="4" ry="6" className="bulb-glint" />
        </svg>

        {/* Animated rays — only when on */}
        {on && (
          <span className="lamp-rays" aria-hidden="true">
            {[0,45,90,135,180,225,270,315].map((deg) => (
              <span key={deg} className="lamp-ray" style={{ "--deg": `${deg}deg` } as React.CSSProperties} />
            ))}
          </span>
        )}
      </span>

      {/* Label */}
      <span className="lamp-label">
        {on ? "Padamkan Lampu" : "Nyalakan Lampu"}
      </span>
    </button>
  );
}
