"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // non utilisé, tu peux le retirer si tu veux
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
  // --------- Responsive presets (comme pour le 24" windowed) ----------
  type RS = {
    gapPx: number;
    cardHeightPx: number;
    cardPadPx: number;
    scrollerHeightPx: number;
    titleCls: string; // "Next Pill Block", "Current Block", "Global Pills"
    valueCls: string; // valeurs numériques (50 / 49 / 12,324)
  };

  const compute = React.useCallback((): RS => {
    if (typeof window === "undefined") {
      return {
        gapPx: 24,
        cardHeightPx: 192, // ~ h-48
        cardPadPx: 24, // ~ p-6
        scrollerHeightPx: 48,
        titleCls: "text-xl",
        valueCls: "text-3xl",
      };
    }
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Compact pour 24" windowed (1440×800/900) et pour toutes hauteurs ≤ 900
    const isWindowed24 =
      w === 1440 && (h === 800 || h === 900 || (h >= 780 && h <= 920));
    const shortHeight = h <= 900;

    if (isWindowed24 || shortHeight) {
      // un cran plus compact
      return {
        gapPx: 16, // moins d’espace entre cartes
        cardHeightPx: 176, // ex: h-44
        cardPadPx: 20, // p-5
        scrollerHeightPx: 40, // bande un peu moins haute
        titleCls: "text-lg",
        valueCls: "text-2xl",
      };
    }

    // défaut desktop
    return {
      gapPx: 24,
      cardHeightPx: 192,
      cardPadPx: 24,
      scrollerHeightPx: 48,
      titleCls: "text-xl",
      valueCls: "text-3xl",
    };
  }, []);

  const [rs, setRs] = React.useState<RS>(compute);
  React.useEffect(() => {
    const onR = () => setRs(compute());
    onR();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [compute]);

  return (
    // ici: simple colonne, c’est le parent (aside dans page.tsx) qui gère le cadre
    <aside
      className="flex flex-col"
      style={{ gap: `${rs.gapPx}px` }}
      aria-label="Right stats cards"
    >
      {/* Bloc 1 */}
      <CardBase glow="orange" heightPx={rs.cardHeightPx} padPx={rs.cardPadPx}>
        <p className={`text-sm text-zinc-300`}>Next Pill Block:</p>
        <p className={`mt-2 font-extrabold tracking-tight ${rs.valueCls}`}>
          {formatNumber(nextBlock)}
        </p>

        <div className="mt-4 w-full">
          {/* bande qui défile en boucle, sans trou ni étirement */}
          <BackgroundStripScroller
            src="/trackpill.png"
            stripWidth={24000}
            stripHeight={32}
            displayHeight={rs.scrollerHeightPx} // garde la logique, mais plus compact si besoin
            speedPps={30}
            direction="rtl"
          />
        </div>
      </CardBase>

      {/* Bloc 2 */}
      <CardBase glow="orange" heightPx={rs.cardHeightPx} padPx={rs.cardPadPx}>
        <p className={`${rs.titleCls} font-semibold text-zinc-300`}>
          Current Block:
        </p>
        <p className={`mt-2 font-extrabold tracking-tight ${rs.valueCls}`}>
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
      <CardBase glow="white" heightPx={rs.cardHeightPx} padPx={rs.cardPadPx}>
        <p className={`${rs.titleCls} font-semibold text-zinc-300`}>
          Global Pills:
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className={`font-extrabold tracking-tight ${rs.valueCls}`}>
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
  );
}

/* ---------- CardBase (glow contenu) ---------- */
function CardBase({
  children,
  glow = "orange",
  heightPx = 192,
  padPx = 24,
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
  heightPx?: number;
  padPx?: number;
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
        style={{ height: `${heightPx}px`, padding: `${padPx}px` }}
      >
        {children}
      </div>

      {/* Aura contenue dans la carte → plus de débordement sur le cadre parent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-15 blur-lg transition-opacity duration-300 peer-hover:opacity-35"
        style={{ background: auraColor, filter: "saturate(1.8)" }}
      />
    </div>
  );
}

/* ---------- Bande infinie via background-repeat ---------- */
function BackgroundStripScroller({
  src,
  stripWidth,
  stripHeight,
  displayHeight = 48,
  speedPps = 120,
  direction = "rtl",
}: {
  src: string;
  stripWidth: number;
  stripHeight: number;
  displayHeight?: number;
  speedPps?: number;
  direction?: "ltr" | "rtl";
}) {
  const scale = displayHeight / stripHeight;
  const tileW = stripWidth * scale; // largeur rendue d'une répétition
  const secsPerTile = tileW / Math.max(1, speedPps);

  const animName = React.useId().replace(/[:]/g, "_") + "_marquee";
  const fromPos = "0px";
  const toPos = (direction === "rtl" ? -tileW : tileW) + "px";

  return (
    <div
      className="relative w-full"
      style={{ height: `${displayHeight}px`, overflow: "hidden" }}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: "0px",
          backgroundPositionY: "center",
          backgroundSize: `auto ${displayHeight}px`,
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
