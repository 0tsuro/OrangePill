"use client";
import * as React from "react";

export default function RankCard({ myRank = 5 }: { myRank?: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-5">
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white/80"
          fill="currentColor"
        >
          <path d="M3 4h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z" />
        </svg>
        <p className="text-base font-semibold">Your Rank:</p>
      </div>
      <p className="text-6xl font-extrabold leading-none tracking-tight text-white">
        {ordinal(myRank).toUpperCase()}
      </p>
    </div>
  );
}

function ordinal(n: number) {
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
