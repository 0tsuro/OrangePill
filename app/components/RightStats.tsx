"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // image exportée (barre) bloc 1
  currentBlockImageSrc = "/block.png", // image décorative bloc 2
  pillRankSrc = "/rankpill.png", // pilule bloc 3
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    // plus d’espace entre les cartes pour éviter que les halos se marchent dessus
    <aside className="flex flex-col gap-6">
      {/* Bloc 1 */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Next Pill Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(nextBlock)}
        </p>
        <div className="mt-4 w-full">
          <ProgressImageBar imageSrc={barImageSrc} />
        </div>
      </CardBase>

      {/* Bloc 2 */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Current Block:</p>
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
        <p className="text-sm text-zinc-300">Global Pills:</p>
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

/* ---------- Building blocks ---------- */

// Aura floue douce + anneau coloré autour de la carte.
// Isolation pour que les blurs ne se mélangent pas entre cartes.
function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const auraColor = glow === "orange" ? "#FF6600" : "#FFFFFF";

  return (
    <div className="relative isolate">
      {/* Aura / glow derrière la carte (plus “fluo” mais doux) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-2xl blur-2xl"
        style={{
          background: auraColor,
          opacity: glow === "orange" ? 0.2 : 1, // intensité de l’aura
          filter: "saturate(1.1)",
        }}
      />
      {/* Carte */}
      <div
        className={[
          "relative h-48 rounded-xl bg-[#0c0c0c] p-6",
          "flex flex-col items-center justify-center text-center",
          glow === "orange"
            ? "ring-2 ring-[#FF6600BF] shadow-[0_0_14px_#ff66004d,0_0_28px_#ff660026]"
            : "ring-2 ring-white/85 shadow-[0_0_12px_#ffffff40,0_0_22px_#ffffff1f]",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Progress bar (image nette & large pour éviter le flou) ---------- */
function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      <Image
        src={imageSrc}
        alt="progress bar"
        width={2400} // source HD pour garder la netteté
        height={200}
        className="w-full h-8 object-cover pointer-events-none" // un peu plus haute pour être bien lisible
        priority
      />
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
