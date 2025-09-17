"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // ← conserve ton width/height + h-6
  currentBlockImageSrc = "/block.png", // ← conserve 80x80
  pillRankSrc = "/rankpill.png", // ← conserve 256 (HD) + w-16 h-16
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    <aside className="rounded-2xl bg-[#1B1B1B] p-6 flex flex-col gap-6">
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

        {/* 👇 garde ton 80x80 exact pour rester net */}
        <Image
          src={currentBlockImageSrc}
          alt="current block icon"
          width={80}
          height={80}
          className="absolute bottom-3 right-3 object-contain opacity-85 pointer-events-none select-none"
        />
      </CardBase>

      {/* Bloc 3 */}
      <CardBase glow="white">
        <p className="text-sm text-zinc-300">Global Pills:</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <p className="text-3xl font-extrabold tracking-tight">
            {formatNumber(globalPills)}
          </p>

          {/* 👇 asset HD 256x256 downscalé en w-16 h-16 pour un rendu crisp */}
          <Image
            src={pillRankSrc}
            alt="pill rank"
            width={256}
            height={256}
            className="w-16 h-16 object-contain pointer-events-none select-none"
          />
        </div>
      </CardBase>
    </aside>
  );
}

/* ---------- Building blocks ---------- */

function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const isOrange = glow === "orange";
  const borderClass = isOrange ? "border-[#FF6600]" : "border-white/80";
  const ringClass = isOrange
    ? "ring-1 ring-[#FF6600]/60"
    : "ring-1 ring-white/60";
  // Glow doux mais visible (ajusté pour ne pas être trop agressif)
  const glowLayerClass = isOrange
    ? "shadow-[0_0_10px_#FF660066,0_0_24px_#FF660033,0_0_48px_#FF66001a]"
    : "shadow-[0_0_10px_#FFFFFF66,0_0_24px_#FFFFFF33,0_0_48px_#FFFFFF1a]";

  return (
    <div className="relative h-48">
      {" "}
      {/* même hauteur pour tous */}
      {/* couche glow sous la carte (n’altère pas les images) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-xl ${glowLayerClass}`}
      />
      {/* carte */}
      <div
        className={[
          "relative z-10 h-full rounded-xl bg-[#0c0c0c] border p-6",
          "flex flex-col items-center justify-center text-center",
          borderClass,
          ringClass,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Progress bar (garde tes dimensions pour éviter le flou) ---------- */
function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      <Image
        src={imageSrc}
        alt="progress bar"
        width={2400} // grande source (netteté)
        height={200}
        className="w-full h-6 object-cover pointer-events-none" // 👈 h-6 comme ton code
        priority
      />
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US"); // stable SSR/CSR
function formatNumber(n: number) {
  return nf.format(n);
}
