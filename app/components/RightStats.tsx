"use client";
import React from "react";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png",
  currentBlockImageSrc = "/block.png",
  pillRankSrc = "/pillrank.png",
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    <aside className="flex flex-col gap-3 rounded-lg border border-white/10 bg-zinc-900/40 p-3">
      {/* Bloc 1 */}
      <StatCardGlow
        title="Next Pill Block:"
        value={formatNumber(nextBlock)}
        glow="orange"
        footer={<ProgressImageBar imageSrc={barImageSrc} />}
        center
      />

      {/* Bloc 2 */}
      <StatCardLarge
        title="Current Block:"
        value={formatNumber(currentBlock)}
        imageSrc={currentBlockImageSrc}
      />

      {/* Bloc 3 */}
      <StatCardGlow
        title="Global Pills:"
        value={
          <span className="inline-flex items-center gap-2">
            {formatNumber(globalPills)}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pillRankSrc}
              alt="pill rank"
              className="w-5 h-5 object-contain select-none pointer-events-none"
            />
          </span>
        }
        glow="white"
        center
      />
    </aside>
  );
}

/* ---------- Cartes ---------- */

function StatCardGlow({
  title,
  value,
  footer,
  glow = "orange",
  center = false,
}: {
  title: string;
  value: number | string | React.ReactNode;
  footer?: React.ReactNode;
  glow?: "orange" | "white";
  center?: boolean;
}) {
  const ring =
    glow === "orange"
      ? "shadow-[0_0_16px_#ff660055] ring-1 ring-[#FF6600]"
      : "shadow-[0_0_16px_#ffffff55] ring-1 ring-white";

  return (
    <div className="rounded-xl bg-[#111] p-1">
      <div
        className={
          "rounded-xl bg-[#0c0c0c] p-3 border " +
          (glow === "orange" ? "border-[#FF6600]" : "border-white/80") +
          " " +
          ring
        }
      >
        <div className={center ? "text-center flex flex-col items-center" : ""}>
          <p className="text-[10px] text-zinc-200">{title}</p>
          <p className="mt-1 text-xl font-extrabold tracking-tight">{value}</p>
        </div>
        {footer && <div className={center ? "mt-3 w-full" : ""}>{footer}</div>}
      </div>
    </div>
  );
}

/** Bloc 2 : plus grand, image décorative + shadow orange */
function StatCardLarge({
  title,
  value,
  imageSrc,
}: {
  title: string;
  value: number | string;
  imageSrc: string;
}) {
  return (
    <div className="rounded-xl bg-[#111] p-1">
      <div className="relative rounded-xl bg-[#0c0c0c] p-4 border border-[#FF6600] h-36 flex flex-col justify-center items-center overflow-hidden shadow-[0_0_16px_#ff660055] ring-1 ring-[#FF6600]">
        <div className="text-center">
          <p className="text-sm text-zinc-300">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">
            {value}
          </p>
        </div>

        {/* Image bas-droite */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="current block icon"
          className="absolute bottom-2 right-2 w-16 h-16 object-contain opacity-85 pointer-events-none select-none"
        />
      </div>
    </div>
  );
}

/** Image de barre (bloc 1) */
function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt="progress bar"
        className="w-full h-6 object-cover rounded-md pointer-events-none"
      />
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
