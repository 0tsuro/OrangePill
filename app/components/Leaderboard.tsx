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
  onOpen?: () => void;
};

const nf = new Intl.NumberFormat("en-US");
const formatNumber = (n: number) => nf.format(n);

export default function Leaderboard({
  leaders,
  pillIconSrc = "/trophy.svg",
  pillRankSrc = "/orangepill.png",
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

  // ---- match RankCard width and padding in 24" windowed (1440x800/900)
  const [padClass, setPadClass] = React.useState("p-5");
  React.useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isWindowed24 = w === 1440 && (h === 800 || h === 900);
      setPadClass(isWindowed24 ? "p-4 pb-5" : "p-5");
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

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
    <div
      className={[
        "w-full rounded-2xl border border-white/10 bg-[#1B1B1B]",
        padClass,
      ].join(" ")}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <Image
          src={pillIconSrc}
          alt="Leaderboard Icon"
          width={32}
          height={32}
          priority
        />
        <h2 className="text-xl font-semibold">Leaderboard</h2>
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
                  <span
                    className="truncate text-sm font-semibold text-white/90"
                    style={{ fontFamily: "Poppins" }}
                  >
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
                    width={26}
                    height={26}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* CTA */}
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
