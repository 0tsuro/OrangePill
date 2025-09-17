"use client";
import React from "react";
import Image from "next/image";

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
            <Image
              src={pillRankSrc}
              alt="pill rank"
              width={20}
              height={20}
              className="object-contain select-none pointer-events-none"
            />
          </span>
        }
        glow="white"
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
}: {
  title: string;
  value: number | string | React.ReactNode;
  footer?: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const ring =
    glow === "orange"
      ? "shadow-[0_0_16px_#ff660055] ring-1 ring-[#FF6600]"
      : "shadow-[0_0_16px_#ffffff55] ring-1 ring-white";

  return (
    <div className="rounded-xl bg-[#111] p-1 min-h-[160px]">
      <div
        className={
          "h-full rounded-xl bg-[#0c0c0c] border p-6 flex flex-col items-center justify-center text-center " +
          (glow === "orange" ? "border-[#FF6600]" : "border-white/80") +
          " " +
          ring
        }
      >
        <p className="text-xs text-zinc-200">{title}</p>
        <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
        {footer && <div className="mt-3 w-full">{footer}</div>}
      </div>
    </div>
  );
}

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
    <div className="relative rounded-xl bg-[#0c0c0c] border border-white/10 min-h-[160px] flex flex-col justify-center items-center text-center p-6 overflow-hidden shadow-[0_0_16px_#ff660055] ring-1 ring-[#FF6600]">
      <div>
        <p className="text-sm text-zinc-300">{title}</p>
        <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">
          {value}
        </p>
      </div>
      <Image
        src={imageSrc}
        alt="current block icon"
        width={64}
        height={64}
        className="absolute bottom-3 right-3 object-contain opacity-80 pointer-events-none select-none"
      />
    </div>
  );
}

function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      <Image
        src={imageSrc}
        alt="progress bar"
        width={300}
        height={24}
        className="w-full h-5 object-cover rounded-md pointer-events-none"
      />
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
