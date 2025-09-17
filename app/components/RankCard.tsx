"use client";
import * as React from "react";
import Image from "next/image";

export default function RankCard({ myRank }: { myRank: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#181818] p-5 pb-6">
      <div className="mb-3 flex items-center gap-2">
        <Image src="/podium.svg" width={32} height={32} alt="" />
        <p className="text-lg font-semibold">Your Rank:</p>
      </div>
      <div className="flex items-center justify-center p-8">
        <p className="text-4xl font-extrabold leading-none tracking-tight text-white">
          {ordinal(myRank).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/* helper local (plus d'import externe) */
function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
