"use client";
import * as React from "react";
import NextImage from "next/image";

type CupProps = {
  connected: boolean;
  onToggleConnect: () => void;
  onOpenSettings: () => void;

  initialPills?: number;
  pillSrc?: string;

  cupSrc?: string;
  cupRimSrc?: string | null;
  settingsIconSrc?: string;

  maskSrc?: string;

  innerPathD?: string;
  vbWidth?: number;
  vbHeight?: number;

  imgOffsetX?: number;
  imgOffsetY?: number;
  imgScale?: number;

  /** micro-corrections en px CSS pour gommer l’écart à droite/bas */
  maskInsetLeftCss?: number;
  maskInsetRightCss?: number;
  maskInsetTopCss?: number;
  maskInsetBottomCss?: number;

  /** Remonte visuellement le bloc sans affecter la logique */
  cupLiftPx?: number;
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
  pillSrc = "/orangepill.png",

  cupSrc = "/cup.png",
  cupRimSrc = null,
  settingsIconSrc = "/settings.svg",
  maskSrc = "/cup-mask.png",

  innerPathD = "M498.979 599.279C307.855 629.4 210.29 630.338 19.2495 599.286C18.2497 599.123 17.4831 598.267 17.4585 597.255L3.072 5.71579C3.04323 4.53298 3.9942 3.55859 5.17736 3.55859H513.156C514.34 3.55859 515.291 4.5332 515.262 5.71614L500.78 597.246C500.755 598.263 499.983 599.12 498.979 599.279Z",

  vbWidth = 512.29,
  vbHeight = 618.67,

  imgOffsetX = 0,
  imgOffsetY = 0,
  imgScale = 1,

  maskInsetLeftCss = 0,
  maskInsetRightCss = 60,
  maskInsetTopCss = 0,
  maskInsetBottomCss = 70,

  cupLiftPx = 24,
}: CupProps) {
  const [pills] = React.useState(initialPills);
  const [selectedChip, setSelectedChip] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null); // 👈 nouveau: on mesure CE conteneur
  const hostRef = React.useRef<HTMLDivElement>(null);
  const pillsRef = React.useRef<Pill[]>([]);
  const sizeRef = React.useRef({ w: 0, h: 0 });
  const rafRef = React.useRef<number | null>(null);

  const maskImageRef = React.useRef<HTMLImageElement | null>(null);
  const maskCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pxPerCssXRef = React.useRef(1);
  const pxPerCssYRef = React.useRef(1);
  const [maskReady, setMaskReady] = React.useState(false);

  const targetSpriteCount = Math.min(48, Math.max(10, Math.floor(pills / 28)));

  const rebuildMaskCanvas = React.useCallback(() => {
    const container = containerRef.current;
    const maskImg = maskImageRef.current;
    if (!container || !maskImg) return;

    const rect = container.getBoundingClientRect(); // 👈 on mesure hors <foreignObject>
    const Wcss = rect.width;
    const Hcss = rect.height;
    if (Wcss <= 0 || Hcss <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(Wcss * dpr));
    canvas.height = Math.max(1, Math.round(Hcss * dpr));

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const pxPerCssX = canvas.width / Wcss;
    const pxPerCssY = canvas.height / Hcss;
    pxPerCssXRef.current = pxPerCssX;
    pxPerCssYRef.current = pxPerCssY;

    // repère CSS → device px
    ctx.setTransform(pxPerCssX, 0, 0, pxPerCssY, 0, 0);
    // viewBox → CSS (le SVG occupe toute la boîte, même ratio grâce à aspect-ratio)
    ctx.scale(Wcss / vbWidth, Hcss / vbHeight);

    // insets convertis en unités viewBox
    const insetL = (maskInsetLeftCss * vbWidth) / Wcss;
    const insetR = (maskInsetRightCss * vbWidth) / Wcss;
    const insetT = (maskInsetTopCss * vbHeight) / Hcss;
    const insetB = (maskInsetBottomCss * vbHeight) / Hcss;

    ctx.clearRect(0, 0, vbWidth, vbHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      maskImg,
      insetL,
      insetT,
      vbWidth - insetL - insetR,
      vbHeight - insetT - insetB
    );

    maskCanvasRef.current = canvas;
    setMaskReady(true);
  }, [
    vbWidth,
    vbHeight,
    maskInsetLeftCss,
    maskInsetRightCss,
    maskInsetTopCss,
    maskInsetBottomCss,
  ]);

  const loadMaskImage = React.useCallback(() => {
    if (!maskSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      maskImageRef.current = img;
      rebuildMaskCanvas();
    };
    img.src = maskSrc;
  }, [maskSrc, rebuildMaskCanvas]);

  // 👉 Observe le CONTENEUR (pas le host dans <foreignObject>)
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onResize = () => {
      const r = el.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
      if (maskImageRef.current) rebuildMaskCanvas();
    };

    onResize(); // force un premier passage (Vercel)
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rebuildMaskCanvas]);

  React.useEffect(() => {
    loadMaskImage();
  }, [loadMaskImage]);

  const isPointAllowed = React.useCallback((x: number, y: number): boolean => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const px = Math.max(
      0,
      Math.min(canvas.width - 1, Math.floor(x * pxPerCssXRef.current))
    );
    const py = Math.max(
      0,
      Math.min(canvas.height - 1, Math.floor(y * pxPerCssYRef.current))
    );

    try {
      const a = ctx.getImageData(px, py, 1, 1).data[3];
      return a > 10;
    } catch {
      return false;
    }
  }, []);

  function rectFullyInsideMask(x: number, y: number, w: number, h: number) {
    const e = 0.5;
    const pts = [
      [x + e, y + e],
      [x + w - e, y + e],
      [x + e, y + h - e],
      [x + w - e, y + h - e],
      [x + w / 2, y + e],
      [x + w / 2, y + h - e],
      [x + e, y + h / 2],
      [x + w - e, y + h / 2],
    ];
    for (const [px, py] of pts) {
      if (!isPointAllowed(px, py)) return false;
    }
    return true;
  }

  function advanceWithClamp(p: Pill, dx: number, dy: number) {
    let lo = 0,
      hi = 1,
      best = 0;
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) * 0.5;
      const nx = p.x + dx * mid;
      const ny = p.y + dy * mid;
      if (rectFullyInsideMask(nx, ny, p.w, p.h)) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    p.x += dx * best;
    p.y += dy * best;
  }

  React.useEffect(() => {
    if (!maskReady) return;
    const host = hostRef.current;
    if (!host) return;
    const arr = pillsRef.current;

    while (arr.length < targetSpriteCount) {
      const w = 32 + Math.random() * 10;
      const h = w;
      const { w: W, h: H } = sizeRef.current;

      let x = 0,
        y = 0,
        tries = 0;
      do {
        x = Math.random() * Math.max(1, W - w);
        y = Math.random() * Math.max(1, H - h);
        tries++;
      } while (tries < 200 && !rectFullyInsideMask(x, y, w, h));

      if (tries >= 200) {
        x = W * 0.3 + Math.random() * (W * 0.4 - w);
        y = H * 0.45 + Math.random() * (H * 0.4 - h);
      }

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
  }, [targetSpriteCount, pillSrc, maskReady]);

  React.useEffect(() => {
    const step = () => {
      for (const p of pillsRef.current) {
        const dx = p.vx;
        const dy = p.vy;

        const nx = p.x + dx;
        const ny = p.y + dy;

        const ok = rectFullyInsideMask(nx, ny, p.w, p.h);
        if (ok) {
          p.x = nx;
          p.y = ny;
        } else {
          advanceWithClamp(p, dx, dy);
          if (!rectFullyInsideMask(p.x + dx, p.y, p.w, p.h)) p.vx *= -1;
          if (!rectFullyInsideMask(p.x, p.y + dy, p.w, p.h)) p.vy *= -1;
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
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full max-w-[560px] mx-auto"
        style={{
          marginTop: `-${cupLiftPx}px`,
          aspectRatio: `${vbWidth} / ${vbHeight}` /* 👈 hauteur non-nulle immédiate */,
        }}
      >
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          className="block h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
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

          <defs>
            <clipPath id="cup-inner-clip" clipPathUnits="userSpaceOnUse">
              <path d={innerPathD} />
            </clipPath>
          </defs>

          <g clipPath="url(#cup-inner-clip)">
            <foreignObject x="0" y="0" width={vbWidth} height={vbHeight}>
              <div
                ref={hostRef}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              />
            </foreignObject>
          </g>

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

        {/* UI identique */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
          <div className="pointer-events-auto flex flex-col items-center">
            {!connected ? (
              <>
                <button
                  onClick={onToggleConnect}
                  className="cursor-pointer mb-7 rounded-xl bg-[#FF6600] px-6 py-2.5 text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
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
                  className="cursor-pointer mt-5 rounded-xl bg-[#FF6600] px-7 py-3 text-lg font-extrabold text-white shadow-[0_12px_28px_rgba(255,102,0,.35)] transition hover:brightness-110 active:scale-[0.98]"
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
                        onClick={
                          () =>
                            setSelectedChip((prev) => (prev === t ? null : t)) // 👈 toggle
                        }
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
                    <NextImage
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
