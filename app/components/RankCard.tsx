"use client";
import * as React from "react";

/* NOTE: Display user's rank.
 * TODO: Provide `myRank` from backend (/api/rank?addr=...).
 */
export default function RankCard({ myRank }: { myRank: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
      <p className="mb-1 text-sm text-zinc-400">Your Rank:</p>
      <p className="text-6xl font-extrabold leading-none tracking-tight text-white">
        {ordinal(myRank).toUpperCase()}
      </p>
    </div>
  );
}

/* NOTE: Local ordinal helper (kept here to avoid import mismatch). */
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
