"use client";
import * as React from "react";
import Image from "next/image";

type CupProps = {
  connected: boolean;
  onToggleConnect: () => void;
  onOpenSettings: () => void;

  initialPills?: number;
  pillSrc?: string;

  /** Cup visuals */
  cupSrc?: string; // full cup image (body)
  cupRimSrc?: string | null; // optional rim/lid overlay (for depth), null if none
  settingsIconSrc?: string;

  /** Vector path (inner hole) from Figma – EXACT d=… */
  innerPathD?: string;

  /** Figma canvas size of that path (so we can use the same viewBox) */
  vbWidth?: number; // default 512.29
  vbHeight?: number; // default 618.67

  /** Fine-tune if your PNG isn't on the exact same canvas as the vector */
  imgOffsetX?: number; // in viewBox units
  imgOffsetY?: number; // in viewBox units
  imgScale?: number; // scale image inside viewBox (1 = no scale)
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
  pillSrc = "/rankpill.png",

  cupSrc = "/cup.png",
  cupRimSrc = null,
  settingsIconSrc = "/settings.svg",

  // Paste your exact Figma path here (the one you sent):
  innerPathD = "M498.979 599.279C307.855 629.4 210.29 630.338 19.2495 599.286C18.2497 599.123 17.4831 598.267 17.4585 597.255L3.072 5.71579C3.04323 4.53298 3.9942 3.55859 5.17736 3.55859H513.156C514.34 3.55859 515.291 4.5332 515.262 5.71614L500.78 597.246C500.755 598.263 499.983 599.12 498.979 599.279Z",

  // The viewBox must match the Figma canvas of that path
  vbWidth = 512.29,
  vbHeight = 618.67,

  // If your PNG isn't pixel-aligned to that same canvas, tweak these slightly
  imgOffsetX = 0,
  imgOffsetY = 0,
  imgScale = 1,
}: CupProps) {
  const [pills] = React.useState(initialPills);
  const [selectedChip, setSelectedChip] = React.useState<string | null>(null);

  const hostRef = React.useRef<HTMLDivElement>(null);
  const pillsRef = React.useRef<Pill[]>([]);
  const sizeRef = React.useRef({ w: 0, h: 0 });
  const rafRef = React.useRef<number | null>(null);

  // sprite count scales with total pills (bounded)
  const targetSpriteCount = Math.min(48, Math.max(10, Math.floor(pills / 28)));

  // Measure responsive host size (inside foreignObject)
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => {
      const r = host.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // Create/remove pills to match target count
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const arr = pillsRef.current;

    while (arr.length < targetSpriteCount) {
      const w = 14 + Math.random() * 6;
      const h = w;
      const { w: W, h: H } = sizeRef.current;

      // spawn anywhere inside the masked area
      const x = Math.random() * Math.max(1, W - w);
      const y = Math.random() * Math.max(1, H - h);

      const img = document.createElement("img");
      img.src = pillSrc;
      img.alt = "pill";
      img.style.position = "absolute";
      img.style.willChange = "transform";
      img.style.pointerEvents = "none";
      img.style.opacity = "0.55";
      img.style.filter = "drop-shadow(0 2px 5px rgba(0,0,0,.35))";

      host.appendChild(img);

      arr.push({
        el: img,
        x,
        y,
        w,
        h,
        vx: (Math.random() * 0.18 + 0.06) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.18 + 0.06) * (Math.random() < 0.5 ? -1 : 1),
      });
    }

    while (arr.length > targetSpriteCount) {
      const p = arr.pop();
      if (p) p.el.remove();
    }
  }, [targetSpriteCount, pillSrc]);

  // Physics / bounce loop
  React.useEffect(() => {
    const step = () => {
      const { w: W, h: H } = sizeRef.current;
      const inset = 8;
      for (const p of pillsRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= inset) {
          p.x = inset;
          p.vx *= -1;
        }
        if (p.x + p.w >= W - inset) {
          p.x = W - inset - p.w;
          p.vx *= -1;
        }
        if (p.y <= inset) {
          p.y = inset;
          p.vy *= -1;
        }
        if (p.y + p.h >= H - inset) {
          p.y = H - inset - p.h;
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
    <div className="relative flex h-full w-full items-end justify-center">
      {/* Keep it responsive with a max width; the SVG scales itself */}
      <div className="relative w-full max-w-[560px]">
        {/* SVG uses the SAME viewBox as your Figma path → alignment is exact */}
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Cup image, placed in viewBox coords (fine-tunable via offset/scale) */}
          <g
            transform={`translate(${imgOffsetX}, ${imgOffsetY}) scale(${imgScale})`}
          >
            <image
              href={cupSrc}
              x="0"
              y="0"
              width={vbWidth}
              height={vbHeight}
            />
          </g>

          {/* Define the clipPath in USER SPACE (matches your Figma path exactly) */}
          <defs>
            <clipPath id="cup-inner-clip" clipPathUnits="userSpaceOnUse">
              <path d={innerPathD} />
            </clipPath>
          </defs>

          {/* Pills: a responsive HTML host clipped by the exact inner path */}
          <foreignObject
            x="0"
            y="0"
            width={vbWidth}
            height={vbHeight}
            clipPath="url(#cup-inner-clip)"
          >
            <div
              ref={hostRef}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                // debug: background: "rgba(0,255,0,0.06)",
              }}
            />
          </foreignObject>

          {/* Optional: rim/lid overlay for depth (sits on top) */}
          {cupRimSrc && (
            <g
              transform={`translate(${imgOffsetX}, ${imgOffsetY}) scale(${imgScale})`}
            >
              <image
                href={cupRimSrc}
                x="0"
                y="0"
                width={vbWidth}
                height={vbHeight}
                style={{ pointerEvents: "none" }}
              />
            </g>
          )}
        </svg>

        {/* UI overlay above everything, unchanged */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
          <div className="pointer-events-auto flex flex-col items-center">
            {!connected ? (
              <>
                <button
                  onClick={onToggleConnect}
                  className="mb-7 rounded-xl bg-[#FF6600] px-6 py-2.5 text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Connect Wallet
                </button>
                <p className="text-[13px] text-zinc-300">
                  Connect Your Wallet to Claim Pills!
                </p>
              </>
            ) : (
              <>
                <div className="mb-4 rounded-md bg-white/10 px-6 py-2">
                  <p className="text-lg font-extrabold tracking-wide">
                    Your Pills
                  </p>
                </div>
                <p className="text-[60px] font-extrabold leading-none text-[#FF6600] drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
                  {new Intl.NumberFormat("en-US").format(pills)}
                </p>
                <p className="mt-3 text-center text-[13px] font-semibold text-white">
                  Take more to climb
                  <br /> the leaderboard!
                </p>
                <button
                  onClick={onOpenSettings}
                  className="mt-5 rounded-xl bg-[#FF6600] px-7 py-3 text-lg font-extrabold text-white shadow-[0_12px_28px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Take Your Pill
                </button>
                <div className="mt-5 flex items-center gap-4">
                  {(["x10", "x50", "x20"] as const).map((t) => {
                    const isActive = selectedChip === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedChip(t)}
                        aria-pressed={isActive}
                        title={`Select ${t}`}
                        className={[
                          "cursor-pointer rounded-xl px-4 py-2 text-sm font-bold transition",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600]",
                          "active:scale-[0.98] hover:-translate-y-[1px]",
                          "bg-[#1b1b1b] text-white ring-1 ring-white/15",
                          "shadow-[0_0_0_6px_rgba(255,255,255,0.04),0_6px_14px_rgba(0,0,0,0.35)]",
                          "hover:ring-white/30",
                          isActive
                            ? "bg-[#FF6600] text-black ring-[#FF6600] shadow-[0_0_10px_#ff660055,0_0_24px_#ff660033]"
                            : "",
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    );
                  })}
                  <button
                    onClick={onOpenSettings}
                    aria-label="Settings"
                    className="cursor-pointer grid place-items-center rounded-xl bg-[#1b1b1b] p-2 ring-1 ring-white/15 shadow-[0_0_0_6px_rgba(255,255,255,0.04),0_6px_14px_rgba(0,0,0,0.35)] transition hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] active:scale-[0.98]"
                  >
                    <Image
                      src={settingsIconSrc}
                      alt="Settings"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
