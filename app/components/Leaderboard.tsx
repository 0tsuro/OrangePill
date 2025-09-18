"use client";
import * as React from "react";
import Image from "next/image";

export type Leader = { addr: string; score: number };

type Props = {
  leaders: Leader[];
  pillIconSrc?: string;
  pillRankSrc?: string;
  activeIndex?: number;
  forceScrollDemo?: boolean;
  /** 👈 NEW: called when CTA is clicked */
  onOpen?: () => void;
};

const nf = new Intl.NumberFormat("en-US");
const formatNumber = (n: number) => nf.format(n);

export default function Leaderboard({
  leaders,
  pillIconSrc = "/pillrank.png",
  pillRankSrc = "/rankpill.png",
  activeIndex,
  forceScrollDemo = true,
  onOpen,
}: Props) {
  const [current, setCurrent] = React.useState<number | null>(
    typeof activeIndex === "number" ? activeIndex : null
  );

  React.useEffect(() => {
    if (typeof activeIndex === "number") setCurrent(activeIndex);
  }, [activeIndex]);

  const data = React.useMemo(() => {
    if (!forceScrollDemo) return leaders;
    const extras: Leader[] = [
      { addr: "bc1extra001", score: 700 },
      { addr: "bc1extra002", score: 650 },
      { addr: "bc1extra003", score: 600 },
      { addr: "bc1extra004", score: 550 },
      { addr: "bc1extra005", score: 500 },
      { addr: "bc1extra006", score: 450 },
    ];
    return leaders.length >= 10
      ? leaders
      : [...leaders, ...extras].slice(0, 12);
  }, [leaders, forceScrollDemo]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-4 pb-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <Image
          src={pillIconSrc}
          alt="Leaderboard Icon"
          width={24}
          height={24}
          priority
        />
        <h2 className="text-base font-semibold">Leaderboard</h2>
      </div>

      {/* Scrollable list */}
      <div
        className="scrollwrap max-h-72 overflow-y-scroll pr-5 py-1"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.6) transparent",
        }}
      >
        <ul className="space-y-2.5">
          {data.map((l, i) => {
            const isActive = i === current;
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
                onClick={() => setCurrent(i)}
                className={[
                  "ml-1 mr-2 flex items-center justify-between gap-2 rounded-xl px-3 py-2 cursor-pointer transition",
                  "border border-white/5 bg-[#141414]",
                  isActive
                    ? "shadow-[0_0_5px_#FF6600,inset_0_0_2px_#FF6600]"
                    : "hover:shadow-[0_0_5px_#FF6600,inset_0_0_2px_#FF6600]",
                ].join(" ")}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="w-6 text-right text-xs font-extrabold"
                    style={{ color: rankColor }}
                  >
                    {i + 1}.
                  </span>
                  <span className="truncate text-sm text-white/90">
                    {shortAddr(l.addr)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white/95">
                    {formatNumber(l.score)}
                  </span>
                  <Image
                    src={pillRankSrc}
                    alt="rank pill"
                    width={18}
                    height={18}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* CTA -> opens your nice LeaderboardModal */}
      <button
        type="button"
        onClick={onOpen}
        className="cursor-pointer mt-4 w-full rounded-xl bg-[#FF6600] px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(255,102,0,.35)] hover:brightness-110 active:scale-[0.98] transition"
      >
        Open Leaderboard
      </button>

      {/* WebKit scrollbar */}
      <style jsx>{`
        .scrollwrap::-webkit-scrollbar {
          width: 2px;
        }
        .scrollwrap::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 9999px;
        }
        .scrollwrap::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function shortAddr(a: string) {
  if (!a) return "";
  const clean = a.replace(/\s+/g, "");
  return clean.length <= 12 ? clean : `${clean.slice(0, 6)}…${clean.slice(-4)}`;
}
