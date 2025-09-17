"use client";
import * as React from "react";
import Image from "next/image";

type CupProps = {
  connected: boolean;
  onToggleConnect: () => void;
  onOpenSettings?: () => void;

  /** initial count */
  initialPills?: number;

  /** assets */
  cupSrc?: string;
  pillSrc?: string;

  /** turn on diagnostics */
  debug?: boolean;
};

type Pill = {
  el: HTMLImageElement | HTMLDivElement; // div fallback if image fails
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  isFallback: boolean;
};

export default function Cup({
  connected,
  onToggleConnect,
  onOpenSettings = () => {},
  initialPills = 784,
  cupSrc = "/cup.png",
  pillSrc = "/pillrank.png", // <-- mets bien le fichier dans /public
  debug = false,
}: CupProps) {
  const [pills, setPills] = React.useState(initialPills);
  const [amount, setAmount] = React.useState<number>(10);

  const [imageErrorCount, setImageErrorCount] = React.useState(0);
  const [imageOkCount, setImageOkCount] = React.useState(0);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const playRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const pillsRef = React.useRef<Pill[]>([]);
  const sizeRef = React.useRef({ w: 0, h: 0 });

  const targetSpriteCount = React.useMemo(
    () => Math.max(6, Math.min(80, Math.floor(pills / 12))),
    [pills]
  );

  // Measure area
  React.useEffect(() => {
    if (!playRef.current) return;
    const ro = new ResizeObserver(() => {
      const r = playRef.current!.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
      if (debug) console.log("[Cup] resize area:", sizeRef.current);
    });
    ro.observe(playRef.current);
    const r = playRef.current.getBoundingClientRect();
    sizeRef.current = { w: r.width, h: r.height };
    if (debug) console.log("[Cup] initial area:", sizeRef.current);
    return () => ro.disconnect();
  }, [debug]);

  // Create/remove sprites
  React.useEffect(() => {
    const host = playRef.current;
    if (!host) return;
    const arr = pillsRef.current;

    // adder
    while (arr.length < targetSpriteCount) {
      const w = 26 + Math.random() * 10;
      const h = w;

      // Try <img>, fallback to <div> on error
      const img = document.createElement("img");
      img.src = pillSrc;
      img.alt = "pill";
      img.decoding = "async";
      img.loading = "eager";
      img.style.position = "absolute";
      img.style.willChange = "transform";
      img.style.pointerEvents = "none";
      img.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,.35))";
      img.style.opacity = "0.95";

      // events
      img.onload = () => {
        setImageOkCount((c) => c + 1);
        if (debug) console.log("[Cup] pill image loaded:", pillSrc);
      };
      img.onerror = () => {
        setImageErrorCount((c) => c + 1);
        if (debug)
          console.warn(
            "[Cup] pill image failed:",
            pillSrc,
            "→ using fallback div"
          );
        // Fallback div
        const dot = document.createElement("div");
        dot.style.position = "absolute";
        dot.style.borderRadius = "9999px";
        dot.style.background = "#FF6600";
        dot.style.boxShadow = "0 2px 4px rgba(0,0,0,.35)";
        dot.style.width = `${w}px`;
        dot.style.height = `${h}px`;
        host.appendChild(dot);

        // Create pill entry with the fallback node, and remove the <img>
        const { w: W, h: H } = sizeRef.current;
        const p: Pill = {
          el: dot,
          isFallback: true,
          w,
          h,
          x: Math.random() * Math.max(1, W - w),
          y: Math.random() * Math.max(1, H - h),
          vx: (Math.random() * 1.2 + 0.6) * (Math.random() < 0.5 ? -1 : 1),
          vy: (Math.random() * 1.2 + 0.6) * (Math.random() < 0.5 ? -1 : 1),
        };
        arr.push(p);
        img.remove(); // remove broken img
      };

      // If the image actually loads, push it as sprite
      img.onload = img.onload.bind(img);
      img.onerror = img.onerror.bind(img);

      // Append now, if it loads → good; if error → onerror will swap to div
      host.appendChild(img);

      // Precompute pill with <img> node (will be kept if it loads)
      const { w: W, h: H } = sizeRef.current;
      const p: Pill = {
        el: img,
        isFallback: false,
        w,
        h,
        x: Math.random() * Math.max(1, W - w),
        y: Math.random() * Math.max(1, H - h),
        vx: (Math.random() * 1.2 + 0.6) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 1.2 + 0.6) * (Math.random() < 0.5 ? -1 : 1),
      };
      arr.push(p);
    }

    // remover
    while (arr.length > targetSpriteCount) {
      const p = arr.pop();
      if (p) (p.el as HTMLElement).remove();
    }

    if (debug)
      console.log("[Cup] sprites:", arr.length, "target:", targetSpriteCount);
  }, [targetSpriteCount, pillSrc, debug]);

  // Physics
  React.useEffect(() => {
    const step = () => {
      const arr = pillsRef.current;
      const { w: W, h: H } = sizeRef.current;

      for (const p of arr) {
        p.x += p.vx;
        p.y += p.vy;

        const inset = 4;
        if (p.x <= inset) {
          p.x = inset;
          p.vx *= -1;
        }
        if (p.y <= inset) {
          p.y = inset;
          p.vy *= -1;
        }
        if (p.x + p.w >= W - inset) {
          p.x = W - inset - p.w;
          p.vx *= -1;
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
      rafRef.current = null;
    };
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

  if (!connected) {
    return (
      <div ref={wrapRef} className="relative w-full max-w-[700px]">
        <Image
          src={cupSrc}
          alt="Cup"
          width={700}
          height={560}
          className="z-0 w-full h-auto object-contain select-none pointer-events-none"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <button
            onClick={onToggleConnect}
            className="mb-4 rounded-xl bg-[#FF6600] px-6 py-3 text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
          >
            Connect Wallet
          </button>
          <p className="text-sm text-zinc-300">
            Connect Your Wallet to Claim Pills!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-[700px]">
      {/* background cup image */}
      <Image
        src={cupSrc}
        alt="Cup"
        width={700}
        height={560}
        className="z-0 w-full h-auto object-contain select-none pointer-events-none"
        priority
      />

      {/* bouncing area */}
      <div
        ref={playRef}
        className="pointer-events-none absolute left-1/2 top-[15%] z-10 h-[70%] w-[78%] -translate-x-1/2"
        style={{
          clipPath:
            "polygon(5% 0%, 95% 0%, 90% 10%, 90% 92%, 10% 92%, 10% 10%)",
        }}
      />

      {/* UI overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <div className="mb-3 rounded-md bg-white/10 px-6 py-2">
          <p className="text-2xl font-extrabold tracking-wide">Your Pills</p>
        </div>

        <p className="text-[92px] leading-none font-extrabold text-[#FF6600] drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
          {fmt(pills)}
        </p>

        <p className="mt-2 text-center text-sm text-zinc-300">
          Take more to climb the leaderboard!
        </p>

        <button
          onClick={onOpenSettings}
          className="mt-5 rounded-2xl bg-[#FF6600] px-8 py-4 text-2xl font-extrabold text-white shadow-[0_10px_26px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
        >
          Take Your Pill
        </button>

        <div className="mt-5 flex items-center gap-3">
          {([10, 50, 20] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={[
                "rounded-xl bg-[#0F0F0F] px-4 py-2 text-sm font-bold",
                "ring-1 ring-white/10 hover:ring-white/20",
                amount === v ? "outline outline-2 outline-[#FF6600]" : "",
              ].join(" ")}
              aria-pressed={amount === v}
            >
              x{v}
            </button>
          ))}
          <button
            onClick={() => alert("Settings (placeholder)")}
            className="grid place-items-center rounded-xl bg-[#0F0F0F] px-4 py-2 ring-1 ring-white/10 hover:ring-white/20"
            aria-label="Settings"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white/90"
              fill="currentColor"
            >
              <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.94 7.94 0 00-.2-1.8l2.1-1.6-2-3.4-2.5 1a7.94 7.94 0 00-3.1-1.8l-.4-2.7h-4l-.4 2.7a7.94 7.94 0 00-3.1 1.8l-2.5-1-2 3.4 2.1 1.6A7.94 7.94 0 003 12c0 .6.07 1.2.2 1.8l-2.1 1.6 2 3.4 2.5-1a7.94 7.94 0 003.1 1.8l.4 2.7h4l.4-2.7a7.94 7.94 0 003.1-1.8l2.5 1 2-3.4-2.1-1.6c.13-.6.2-1.2.2-1.8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* DEBUG HUD */}
      {debug && (
        <div className="absolute left-2 top-2 z-30 rounded-md bg-black/60 p-2 text-[11px] leading-4">
          <div className="font-bold">DEBUG</div>
          <div>
            area: {Math.round(sizeRef.current.w)} x{" "}
            {Math.round(sizeRef.current.h)}
          </div>
          <div>
            sprites: {pillsRef.current.length} / target {targetSpriteCount}
          </div>
          <div>
            img ok: {imageOkCount} | img err: {imageErrorCount}
          </div>
          <div>
            pillSrc: <code>{pillSrc}</code>
          </div>
          <div className="mt-1 text-white/60">z: cup=0, pills=10, ui=20</div>
        </div>
      )}
    </div>
  );
}
