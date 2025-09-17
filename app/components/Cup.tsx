"use client";
import * as React from "react";
import Image from "next/image";

type CupProps = {
  connected: boolean;
  onToggleConnect: () => void;
  onOpenSettings: () => void;
  initialPills?: number;
  cupSrc?: string;
  pillSrc?: string;
};

type Pill = {
  el: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
};

export default function Cup({
  connected,
  onToggleConnect,
  onOpenSettings,
  initialPills = 784,
  cupSrc = "/cup.png",
  pillSrc = "/rankpill.png",
}: CupProps) {
  const [pills] = React.useState(initialPills);

  const playRef = React.useRef<HTMLDivElement>(null);
  const pillsRef = React.useRef<Pill[]>([]);
  const sizeRef = React.useRef({ w: 0, h: 0 });
  const rafRef = React.useRef<number>();

  // smaller, slower, more even
  const targetSpriteCount = Math.min(42, Math.max(8, Math.floor(pills / 32)));

  /* measure inner area */
  React.useEffect(() => {
    const host = playRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      sizeRef.current = {
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      };
    });
    ro.observe(host);
    const r = host.getBoundingClientRect();
    sizeRef.current = { w: r.width, h: r.height };
    return () => ro.disconnect();
  }, []);

  /* spawn/remove to match target */
  React.useEffect(() => {
    const host = playRef.current;
    if (!host) return;
    const arr = pillsRef.current;

    while (arr.length < targetSpriteCount) {
      const w = 14 + Math.random() * 6; // smaller than before
      const h = w;
      const { w: W, h: H } = sizeRef.current;

      // evenly distributed across full bottom area
      const x = Math.random() * Math.max(1, W - w);
      const y = H * (0.2 + Math.random() * 0.7);

      const img = document.createElement("img");
      img.src = pillSrc;
      img.alt = "pill";
      img.style.position = "absolute";
      img.style.willChange = "transform";
      img.style.pointerEvents = "none";
      img.style.opacity = "0.55"; // softer
      img.style.filter = "drop-shadow(0 2px 5px rgba(0,0,0,.35))";

      host.appendChild(img);

      arr.push({
        el: img,
        x,
        y,
        w,
        h,
        // slower speed + random dir (prevents grouping)
        vx: (Math.random() * 0.22 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.22 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
      });
    }

    while (arr.length > targetSpriteCount) {
      const p = arr.pop();
      if (p) p.el.remove();
    }
  }, [targetSpriteCount, pillSrc]);

  /* physics with bigger inset (never clipped) */
  React.useEffect(() => {
    const step = () => {
      const S = sizeRef.current;
      const arr = pillsRef.current;
      const inset = 10; // larger guard

      for (const p of arr) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= inset) {
          p.x = inset;
          p.vx *= -1;
        }
        if (p.x + p.w >= S.w - inset) {
          p.x = S.w - inset - p.w;
          p.vx *= -1;
        }
        if (p.y <= inset) {
          p.y = inset;
          p.vy *= -1;
        }
        if (p.y + p.h >= S.h - inset) {
          p.y = S.h - inset - p.h;
          p.vy *= -1;
        }

        const node = p.el as HTMLElement;
        node.style.transform = `translate(${p.x}px, ${p.y}px)`;
        node.style.width = `${p.w}px`;
        node.style.height = `${p.h}px`;
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-full w-full max-w-[640px]">
        {/* Cup artwork */}
        <Image
          src={cupSrc}
          alt="Cup"
          width={640}
          height={520}
          className="z-0 h-auto w-full select-none object-contain"
          priority
        />

        {/* Pills play area — overflow hidden + tighter clipPath */}
        <div
          ref={playRef}
          className="pointer-events-none absolute left-1/2 top-[16%] z-10 h-[72%] w-[78%] -translate-x-1/2 overflow-hidden"
          style={{
            clipPath:
              "polygon(8% 0%, 92% 0%, 90% 12%, 90% 95%, 10% 95%, 10% 12%)",
          }}
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          {!connected ? (
            <>
              <button
                onClick={onToggleConnect}
                className="mb-6 rounded-xl bg-[#FF6600] px-8 py-3 text-xl font-extrabold text-white shadow-[0_8px_20px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Connect Wallet
              </button>
              <p className="text-sm text-zinc-300">
                Connect Your Wallet to Claim Pills!
              </p>
            </>
          ) : (
            <>
              {/* Banner */}
              <div className="mb-4 rounded-md bg-white/10 px-8 py-3">
                <p className="text-2xl font-extrabold tracking-wide">
                  Your Pills
                </p>
              </div>

              {/* Orange number */}
              <p className="text-[86px] font-extrabold leading-none text-[#FF6600] drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
                {new Intl.NumberFormat("en-US").format(pills)}
              </p>

              {/* Tagline */}
              <p className="mt-3 text-center font-semibold text-white">
                Take more to climb
                <br /> the leaderboard!
              </p>

              {/* CTA */}
              <button
                onClick={onOpenSettings}
                className="mt-6 rounded-2xl bg-[#FF6600] px-10 py-5 text-2xl font-extrabold text-white shadow-[0_16px_40px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Take Your Pill
              </button>

              {/* Chips + gear (unchanged sizes vs mock) */}
              <div className="mt-5 flex items-center gap-3">
                {["x10", "x50", "x20"].map((t) => (
                  <div
                    key={t}
                    className="rounded-xl bg-[#1b1b1b] px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 shadow-[0_0_0_6px_rgba(255,255,255,0.04),0_6px_14px_rgba(0,0,0,0.35)]"
                  >
                    {t}
                  </div>
                ))}
                <button
                  onClick={onOpenSettings}
                  className="grid place-items-center rounded-xl bg-[#1b1b1b] p-2 ring-1 ring-white/15 shadow-[0_0_0_6px_rgba(255,255,255,0.04),0_6px_14px_rgba(0,0,0,0.35)]"
                  aria-label="Settings"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-white/90"
                    fill="currentColor"
                  >
                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.9 7.9 0 00-.2-1.8l2.1-1.6-2-3.4-2.5 1a8 8 0 00-3.1-1.8l-.4-2.7h-4l-.4 2.7a8 8 0 00-3.1 1.8l-2.5-1-2 3.4 2.1 1.6A8 8 0 003 12c0 .6.07 1.2.2 1.8l-2.1 1.6 2 3.4 2.5-1a8 8 0 003.1 1.8l.4 2.7h4l.4-2.7a8 8 0 003.1-1.8l2.5 1 2-3.4-2.1-1.6c.13-.6.2-1.2.2-1.8z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
