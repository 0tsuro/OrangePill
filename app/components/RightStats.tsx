"use client";
import * as React from "react";
import Image from "next/image";

export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png",
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
    <aside className="flex flex-col gap-3">
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Next Pill Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(nextBlock)}
        </p>
        <div className="mt-4 w-full">
          <Image
            src={barImageSrc}
            alt="progress bar"
            width={2400}
            height={200}
            className="h-8 w-full object-cover"
            priority
          />
        </div>
      </CardBase>

      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Current Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(currentBlock)}
        </p>
        <Image
          src={currentBlockImageSrc}
          alt="current block icon"
          width={160}
          height={160}
          className="pointer-events-none absolute bottom-3 right-3 h-16 w-16 select-none object-contain opacity-85"
        />
      </CardBase>

      <CardBase glow="white">
        <p className="text-sm text-zinc-300">Global Pills:</p>
        <div className="mt-2 flex items-center justify-center">
          <p className="mr-2 text-3xl font-extrabold tracking-tight">
            {formatNumber(globalPills)}
          </p>
          <Image
            src={pillRankSrc}
            alt="pill"
            width={256}
            height={256}
            className="h-14 w-14 select-none"
          />
        </div>
      </CardBase>
    </aside>
  );
}

function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const glowClass =
    glow === "orange"
      ? "border-[#FF6600] shadow-[0_0_8px_#ff660040,0_0_16px_#ff66001f]"
      : "border-white/80 shadow-[0_0_8px_#ffffff40,0_0_16px_#ffffff1f]";

  return (
    <div
      className={[
        "relative h-48 rounded-xl border bg-[#0c0c0c] p-6",
        "flex flex-col items-center justify-center text-center",
        glowClass,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
