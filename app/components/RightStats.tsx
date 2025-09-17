"use client";
import React from "react";
import Image from "next/image";

/* NOTE: Self-contained right-column stats with background wrapper.
 * TODO: Replace numbers via GET /api/stats (props come from page.tsx).
 */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // exported bar image for block 1
  currentBlockImageSrc = "/block.png", // decorative image for block 2
  pillRankSrc = "/rankpill.png", // pill icon for block 3 (use HD export)
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    <aside className="rounded-2xl bg-[#1B1B1B] p-4 flex flex-col gap-4">
      {/* Block 1: Next Pill Block + bar image */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Next Pill Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(nextBlock)}
        </p>
        <div className="mt-4 w-full">
          <ProgressImageBar imageSrc={barImageSrc} />
        </div>
      </CardBase>

      {/* Block 2: Current Block + bottom-right image */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Current Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(currentBlock)}
        </p>
        <Image
          src={currentBlockImageSrc}
          alt="current block icon"
          width={80} /* NOTE: keep asset HD in /public for sharp result */
          height={80}
          className="absolute bottom-3 right-3 object-contain opacity-85 pointer-events-none select-none"
        />
      </CardBase>

      {/* Block 3: Global Pills + pill icon */}
      <CardBase glow="white">
        <p className="text-sm text-zinc-300">Global Pills:</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <p className="text-3xl font-extrabold tracking-tight">
            {formatNumber(globalPills)}
          </p>
          <Image
            src={pillRankSrc}
            alt="pill rank"
            width={256} /* NOTE: HD source (e.g. 128–256px) */
            height={256}
            className="w-16 h-16 object-contain pointer-events-none select-none"
          />
        </div>
      </CardBase>
    </aside>
  );
}

/* NOTE: Uniform card base (same height + soft glow) */
function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const glowClass =
    glow === "orange"
      ? "border-[#FF6600] shadow-[0_0_6px_#FF660040,0_0_12px_#FF660020]"
      : "border-white/80 shadow-[0_0_6px_#FFFFFF40,0_0_12px_#FFFFFF20]";

  return (
    <div
      className={[
        "relative h-44", // NOTE: same height for all 3 cards
        "rounded-xl bg-[#0c0c0c] border p-6",
        "flex flex-col items-center justify-center text-center",
        glowClass,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* NOTE: Bar image. Use large source to avoid blur; scaled to fit card width. */
function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      <Image
        src={imageSrc}
        alt="progress bar"
        width={2400} /* large source = crisp downscale */
        height={200}
        className="w-full h-6 object-cover pointer-events-none"
        priority
      />
    </div>
  );
}

/* NOTE: Stable number formatting for SSR/CSR parity */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
