"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // (non utilisé ici, tu peux l'enlever si tu veux)
  currentBlockImageSrc = "/block.png",
  pillRankSrc = "/rankpill.png",
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Bloc 1 */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Next Pill Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(nextBlock)}
        </p>

        <div className="mt-4 w-full">
          {/* 👇 bande qui défile en BOUCLE (sans trou, sans étirement) */}
          <BackgroundStripScroller
            src="/trackpill.png"
            stripWidth={24000}
            stripHeight={32}
            displayHeight={48} // EXACTEMENT la même hauteur qu’avant
            speedPps={120} // pixels/seconde (dans les pixels RENDUS)
            direction="rtl" // "rtl" (droite→gauche) ou "ltr"
          />
        </div>
      </CardBase>

      {/* Bloc 2 */}
      <CardBase glow="orange">
        <p
          className="text-xl font-semibold text-zinc-300"
          style={{ fontFamily: "Poppins" }}
        >
          Current Block:
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
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
          className="text-xl font-semibold text-zinc-300"
          style={{ fontFamily: "Poppins" }}
        >
          Global Pills:
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-3xl font-extrabold tracking-tight">
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

/* ---------- CardBase (glow) ---------- */
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
    ? "hover:ring-[#FF6600]/80"
    : "hover:ring-white/90";
  const baseShadow = isOrange
    ? "shadow-[0_0_12px_#ff660026,0_0_28px_#ff660014]"
    : "shadow-[0_0_10px_#ffffff22,0_0_22px_#ffffff10]";
  const hoverShadow = isOrange
    ? "hover:shadow-[0_0_24px_#ff66004d,0_0_52px_#ff66002e]"
    : "hover:shadow-[0_0_20px_#ffffff4d,0_0_44px_#ffffff26]";

  return (
    <div className="relative isolate">
      <div
        className={[
          "relative h-48 rounded-xl bg-[#0c0c0c] p-6",
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
      >
        {children}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-16 blur-xl transition-opacity duration-300 peer-hover:opacity-40"
        style={{ background: auraColor, filter: "saturate(2)" }}
      />
    </div>
  );
}

/* ---------- Bande infinie via background-repeat (solution robuste) ---------- */
/**
 * On n'utilise PAS <Image> pour animer : on s'appuie sur
 * - background-image: url(src)
 * - background-repeat: repeat-x
 * - background-size: auto {displayHeight}px  (=> aucun étirement, ratio 1:1 rendu)
 * - animation CSS sur background-position-x pour une boucle parfaite.
 *
 * Avantages :
 * - Jamais de "trou" : le repeat-x garantit la continuité.
 * - Zéro blur/étirement : on force la hauteur rendue (displayHeight) et la largeur suit le ratio.
 * - Perf lisse (animation CSS, pas de JS à chaque frame).
 */
function BackgroundStripScroller({
  src,
  stripWidth,
  stripHeight,
  displayHeight = 48,
  speedPps = 120, // vitesse en pixels RENDUS / seconde
  direction = "rtl", // "rtl" = défilement vers la gauche visuellement
}: {
  src: string;
  stripWidth: number; // largeur source (utilisé seulement pour calcul de durée)
  stripHeight: number; // hauteur source
  displayHeight?: number;
  speedPps?: number;
  direction?: "ltr" | "rtl";
}) {
  // largeur RENDUE d'une période visuelle à h = displayHeight
  const scale = displayHeight / stripHeight;
  const tileW = stripWidth * scale; // largeur rendue d'UNE répétition
  const secsPerTile = tileW / Math.max(1, speedPps); // durée pour "parcourir" une tuile

  // clé d'anim unique pour éviter les collisions CSS si plusieurs instances
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
          backgroundSize: `auto ${displayHeight}px`, // hauteur FIXE → pas d'étirement
          animation: `${animName} ${secsPerTile}s linear infinite`,
          willChange: "background-position-x",
        }}
      />
      {/* Animation CSS dédiée à CETTE instance */}
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
