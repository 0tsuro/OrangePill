"use client";
import * as React from "react";
import Image from "next/image";
import type { Leader } from "./Leaderboard";

export default function LeaderboardModal({
  open,
  onClose,
  leaders,
  pillIconSrc = "/trophy.svg",
  pillRankSrc = "/orangepill.png",
  activeIndex,
}: {
  open: boolean;
  onClose: () => void;
  leaders: Leader[];
  pillIconSrc?: string;
  pillRankSrc?: string;
  activeIndex?: number;
}) {
  const [query, setQuery] = React.useState("");

  /* Ensure we have enough rows to scroll (fills with clean dummys). */
  const normalized: Leader[] = React.useMemo(() => {
    if ((leaders?.length ?? 0) >= 18) return leaders;
    const base = leaders ?? [];
    const need = 18 - base.length;
    const extras: Leader[] = Array.from({ length: need }).map((_, i) => ({
      addr: `bc1dummy${(i + 1).toString().padStart(3, "0")}xxxxxxxxxxxxxxxx`,
      score: 400 - i * 7,
    }));
    return [...base, ...extras];
  }, [leaders]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((l) => l.addr.toLowerCase().includes(q));
  }, [normalized, query]);

  return (
    <div
      className={`
        fixed inset-0 z-[80] flex items-center justify-center
        transition-opacity duration-200
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Panel (centré via flex parent) */}
      <div
        className={`
          relative z-[81] w-[min(860px,92vw)]
          rounded-[20px] border border-white/10 bg-[#1B1B1B] p-6
          shadow-[0_40px_120px_rgba(0,0,0,.6)]
          transition-all duration-200
          ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }
        `}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={pillIconSrc} alt="" width={72} height={72} />
            <h3 className="text-[16px] font-semibold">Leaderboard</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-[280px]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-[12px] border border-white/10 bg-[#141414] px-9 py-2.5 text-[12.5px] text-white/90 outline-none placeholder:text-white/40"
                placeholder="Search address…"
              />
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-2.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/50"
                fill="currentColor"
                aria-hidden
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>

            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full"
            >
              <Image
                className="cursor-pointer"
                src={"/close.svg"}
                width={24}
                height={24}
                alt=""
              />
            </button>
          </div>
        </div>

        {/* List */}
        <div
          className="scrollwrap max-h-[58vh] overflow-y-auto pr-2"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,.65) transparent",
          }}
        >
          <ul className="space-y-2">
            {filtered.map((l, i) => {
              const highlight =
                typeof activeIndex === "number" && i === activeIndex;
              const rankColor =
                i === 0
                  ? "#F5C542"
                  : i === 1
                  ? "#C0C0C0"
                  : i === 2
                  ? "#CD7F32"
                  : "#9CA3AF";
              return (
                <li
                  key={`${l.addr}-${i}`}
                  className={[
                    "grid grid-cols-[40px_1fr_120px] items-center gap-3 rounded-[12px] border border-white/10 bg-[#141414] px-4 py-2.5",
                    highlight
                      ? "ring-2 ring-[#FF6600B3] shadow-[0_0_10px_#ff660066,0_0_22px_#ff660033]"
                      : "hover:shadow-[0_0_10px_#ff660033]",
                  ].join(" ")}
                >
                  {/* rank */}
                  <div className="flex items-center">
                    <span
                      className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-black/40 px-1 text-[11px] font-bold"
                      style={{ color: rankColor }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* address */}
                  <div className="truncate text-[13px] text-white/85">
                    {shortAddr(l.addr)}
                  </div>

                  {/* score + pill */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[13px] font-semibold text-white/95">
                      {nf.format(l.score)}
                    </span>
                    <Image src={pillRankSrc} alt="" width={16} height={16} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* WebKit scrollbar */}
        <style jsx>{`
          .scrollwrap::-webkit-scrollbar {
            width: 4px;
          }
          .scrollwrap::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.65);
            border-radius: 9999px;
          }
          .scrollwrap::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
      </div>
    </div>
  );
}

/* utils */
const nf = new Intl.NumberFormat("en-US");
function shortAddr(a: string) {
  if (!a) return "";
  const clean = a.replace(/\s+/g, "");
  return clean.length <= 18
    ? clean
    : `${clean.slice(0, 10)}…${clean.slice(-6)}`;
}
