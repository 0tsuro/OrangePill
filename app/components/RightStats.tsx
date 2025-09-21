"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // non utilisé
  currentBlockImageSrc = "/block.png",
  pillRankSrc = "/orangepill.png",
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    <>
      {/* Wrapper responsive piloté par variables CSS */}
      <aside
        className="rs-stats flex flex-col"
        style={{ gap: "var(--rs-gap)" }}
        aria-label="Right stats cards"
      >
        {/* Bloc 1 */}
        <CardBase glow="orange">
          <p className="text-sm text-zinc-300">Next Pill Block:</p>
          <p
            className="mt-2 font-extrabold tracking-tight leading-none"
            style={{ fontSize: "var(--rs-valueSize)" }}
          >
            {formatNumber(nextBlock)}
          </p>

          <div className="mt-4 w-full">
            <BackgroundStripScroller
              src="/trackpill.png"
              stripWidth={24000}
              stripHeight={32}
              speedPps={30}
              direction="rtl"
            />
          </div>
        </CardBase>

        {/* Bloc 2 */}
        <CardBase glow="orange">
          <p
            className="font-semibold text-zinc-300 leading-none"
            style={{ fontSize: "var(--rs-titleSize)" }}
          >
            Current Block:
          </p>
          <p
            className="mt-2 font-extrabold tracking-tight leading-none"
            style={{ fontSize: "var(--rs-valueSize)" }}
          >
            {formatNumber(currentBlock)}
          </p>

          <Image
            src={currentBlockImageSrc}
            alt="current block icon"
            width={100}
            height={100}
            className="absolute bottom-3 right-3 object-contain opacity-85 pointer-events-none select-none"
            priority
          />
        </CardBase>

        {/* Bloc 3 */}
        <CardBase glow="white">
          <p
            className="font-semibold text-zinc-300 leading-none"
            style={{ fontSize: "var(--rs-titleSize)" }}
          >
            Total PILLS Taken:
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p
              className="font-extrabold tracking-tight leading-none"
              style={{ fontSize: "var(--rs-valueSize)" }}
            >
              {formatNumber(globalPills)}
            </p>
            <Image
              src={pillRankSrc}
              alt="pill rank"
              width={256}
              height={256}
              className="w-16 h-16 pointer-events-none select-none"
              priority
            />
          </div>
        </CardBase>
      </aside>

      {/* Variables + MQ responsives (zéro JS, fiable en “windowed”) */}
      <style jsx>{`
        .rs-stats {
          /* défaut desktop */
          --rs-gap: 24px;
          --rs-cardH: 192px; /* ~ h-48 */
          --rs-cardPad: 24px; /* ~ p-6 */
          --rs-scrollerH: 48px;
          --rs-titleSize: 1.125rem; /* ~ text-lg */
          --rs-valueSize: 1.875rem; /* ~ text-3xl */
        }

        /* Fenêtres “basses” (dont 1440×900, 1440×800, etc.) */
        @media (max-height: 900px) {
          .rs-stats {
            --rs-gap: 16px;
            --rs-cardH: 176px; /* ~ h-44 */
            --rs-cardPad: 20px; /* ~ p-5 */
            --rs-scrollerH: 40px;
            --rs-titleSize: 1rem; /* text-base ~ */
            --rs-valueSize: 1.5rem; /* text-2xl ~ */
          }
        }

        /* Encore un cran si très bas (barres visibles, dock, etc.) */
        @media (max-height: 820px) {
          .rs-stats {
            --rs-cardH: 168px;
            --rs-cardPad: 18px;
            --rs-scrollerH: 36px;
            --rs-titleSize: 0.95rem;
            --rs-valueSize: 1.375rem;
          }
        }

        /* Ajustement fin quand la largeur est 1440px et hauteur “basse” */
        @media (max-width: 1500px) and (max-height: 900px) {
          .rs-stats {
            --rs-cardH: 172px;
            --rs-cardPad: 18px;
            --rs-scrollerH: 38px;
          }
        }
      `}</style>
    </>
  );
}

/* ---------- CardBase (glow contenu) ---------- */
function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const isOrange = glow === "orange";
  const auraColor = isOrange ? "#FF6600" : "#FFFFFF";
  const ringBase = isOrange ? "ring-[#FF66001f]" : "ring-white/20";
  const ringHover = isOrange
    ? "hover:ring-[#FF6600]/70"
    : "hover:ring-white/80";

  const baseShadow = isOrange
    ? "shadow-[0_0_12px_#ff660026,0_0_28px_#ff660014]"
    : "shadow-[0_0_10px_#ffffff22,0_0_22px_#ffffff10]";
  const hoverShadow = isOrange
    ? "hover:shadow-[0_0_22px_#ff660045,0_0_46px_#ff660028]"
    : "hover:shadow-[0_0_18px_#ffffff45,0_0_40px_#ffffff26]";

  return (
    <div className="relative isolate">
      <div
        className={[
          "relative rounded-xl bg-[#0c0c0c]",
          "flex flex-col items-center justify-center text-center",
          "peer transition-all duration-300",
          "ring-1",
          ringBase,
          ringHover,
          baseShadow,
          hoverShadow,
          "motion-safe:hover:-translate-y-0.5",
          "will-change-transform will-change-shadow",
        ].join(" ")}
        style={{
          height: "var(--rs-cardH)",
          padding: "var(--rs-cardPad)",
        }}
      >
        {children}
      </div>

      {/* Aura contenue dans la carte → pas de débordement sur le cadre parent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-15 blur-lg transition-opacity duration-300 peer-hover:opacity-35"
        style={{ background: auraColor, filter: "saturate(1.8)" }}
      />
    </div>
  );
}

/* ---------- Bande infinie via background-repeat (responsive) ---------- */
function BackgroundStripScroller({
  src,
  stripWidth,
  stripHeight,
  speedPps = 120,
  direction = "rtl",
}: {
  src: string;
  stripWidth: number;
  stripHeight: number;
  speedPps?: number; // pixels/seconde
  direction?: "ltr" | "rtl";
}) {
  // On lit la hauteur d'affichage depuis la variable CSS (--rs-scrollerH)
  const ref = React.useRef<HTMLDivElement>(null);
  const [displayH, setDisplayH] = React.useState(48);

  React.useEffect(() => {
    const read = () => {
      const el = ref.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const v = cs.getPropertyValue("--rs-scrollerH").trim();
      const n = parseFloat(v);
      if (!Number.isNaN(n) && n > 0) setDisplayH(n);
    };
    read();
    const ro = new ResizeObserver(read);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", read);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);

  // Calcule la durée d'une tuile en fonction de la hauteur rendue
  const scale = displayH / stripHeight;
  const tileW = stripWidth * scale;
  const secsPerTile = tileW / Math.max(1, speedPps);

  const animName = React.useId().replace(/[:]/g, "_") + "_marquee";
  const fromPos = "0px";
  const toPos = (direction === "rtl" ? -tileW : tileW) + "px";

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{
        height: "var(--rs-scrollerH)",
        overflow: "hidden",
      }}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: "0px",
          backgroundPositionY: "center",
          backgroundSize: `auto ${displayH}px`, // suit la var CSS
          animation: `${animName} ${secsPerTile}s linear infinite`,
          willChange: "background-position-x",
        }}
      />
      <style jsx>{`
        @keyframes ${animName} {
          from {
            background-position-x: ${fromPos};
          }
          to {
            background-position-x: ${toPos};
          }
        }
      `}</style>
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
