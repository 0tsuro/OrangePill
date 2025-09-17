"use client";
import * as React from "react";
import Image from "next/image";

/* ---------- Types ---------- */
export type Leader = { addr: string; score: number };

type Props = {
  leaders: Leader[];
  pillIconSrc?: string; // icône header (ex: /trophy.svg ou /pillrank.png)
  pillRankSrc?: string; // icône à droite de chaque ligne (ex: /pillrank.png)
  activeIndex?: number; // index actif initial (0-based)
  forceScrollDemo?: boolean; // si true, rajoute quelques entrées pour forcer le scroll (par défaut false)
};

export default function Leaderboard({
  leaders,
  pillIconSrc = "/trophy.svg",
  pillRankSrc = "/pillrank.png",
  activeIndex,
  forceScrollDemo = false,
}: Props) {
  const [current, setCurrent] = React.useState<number | null>(
    typeof activeIndex === "number" ? activeIndex : null
  );

  React.useEffect(() => {
    if (typeof activeIndex === "number") setCurrent(activeIndex);
  }, [activeIndex]);

  // option: on peut forcer un scroll démo sans polluer la prod
  const data = React.useMemo(() => {
    if (!forceScrollDemo) return leaders;
    return [
      ...leaders,
      { addr: "bc1extra001", score: 700 },
      { addr: "bc1extra002", score: 650 },
      { addr: "bc1extra003", score: 600 },
      { addr: "bc1extra004", score: 550 },
      { addr: "bc1extra005", score: 500 },
      { addr: "bc1extra006", score: 450 },
    ];
  }, [leaders, forceScrollDemo]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-4 pb-5">
      {/* Header (image fournie) */}
      <div className="mb-3 flex items-center gap-2.5">
        <Image
          src={pillIconSrc}
          alt="Leaderboard Icon"
          width={24}
          height={24}
          className="object-contain"
          priority
        />
        <h2 className="text-base font-semibold">Leaderboard</h2>
      </div>

      {/* Wrapper qui scrolle — compact + marge pour la barre */}
      <div
        className="max-h-72 overflow-y-auto pr-3 py-1"
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
                ? "#F5C542" // or
                : i === 1
                ? "#C0C0C0" // argent
                : i === 2
                ? "#CD7F32" // bronze
                : "#9CA3AF"; // gris

            return (
              <li
                key={`${l.addr}-${i}`}
                onClick={() => setCurrent(i)}
                className={[
                  "ml-1 mr-1 flex items-center justify-between gap-2 rounded-xl px-3 py-2 cursor-pointer transition",
                  "border border-white/5 bg-[#141414]",
                  // uniquement des shadows oranges (hover = actif)
                  isActive
                    ? "shadow-[0_0_5px_#FF6600,inset_0_0_2px_#FF6600]"
                    : "hover:shadow-[0_0_5px_#FF6600,inset_0_0_2px_#FF6600]",
                ].join(" ")}
              >
                {/* Rang + adresse */}
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

                {/* Score + pilule */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white/95">
                    {l.score.toLocaleString()}
                  </span>
                  <Image
                    src={pillRankSrc}
                    alt="rank pill"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* CTA bas (compact) */}
      <button
        type="button"
        onClick={() => alert("Open Leaderboard")}
        className="mt-4 w-full rounded-xl bg-[#FF6600] px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(255,102,0,.35)] hover:brightness-110 active:scale-[0.98] transition"
      >
        Open Leaderboard
      </button>

      {/* Scrollbar WebKit — fine et toujours visible */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 9999px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

/* utils */
function shortAddr(a: string) {
  if (!a) return "";
  const clean = a.replace(/\s+/g, "");
  return clean.length <= 12 ? clean : `${clean.slice(0, 6)}…${clean.slice(-4)}`;
}
