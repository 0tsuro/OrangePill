"use client";
import * as React from "react";
import Image from "next/image";

/* ---------- Types ---------- */
export type Leader = { addr: string; score: number };

type Props = {
  leaders: Leader[];
  pillIconSrc?: string; // icône du header (ex: /trophy.svg ou /pillrank.png)
  pillRankSrc?: string; // icône à droite de chaque ligne (ex: /pillrank.png)
  activeIndex?: number; // index actif initial (ex: 4 pour le 5e)
};

export default function Leaderboard({
  leaders,
  pillIconSrc = "/trophy.svg",
  pillRankSrc = "/pillrank.png",
  activeIndex,
}: Props) {
  // on initialise l'état avec la prop si fournie
  const [current, setCurrent] = React.useState<number | null>(
    typeof activeIndex === "number" ? activeIndex : null
  );

  // si la prop change, on la reflète une fois
  React.useEffect(() => {
    if (typeof activeIndex === "number") setCurrent(activeIndex);
  }, [activeIndex]);

  // ➜ on ajoute des éléments pour forcer le scroll sous le top 5 (comme tu l’as demandé)
  const extendedLeaders: Leader[] = React.useMemo(
    () => [
      ...leaders,
      { addr: "bc1extra001", score: 700 },
      { addr: "bc1extra002", score: 650 },
      { addr: "bc1extra003", score: 600 },
      { addr: "bc1extra004", score: 550 },
      { addr: "bc1extra005", score: 500 },
      { addr: "bc1extra006", score: 450 },
    ],
    [leaders]
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1B1B1B] p-6 pb-6">
      {/* Header (ton image) */}
      <div className="mb-5 flex items-center gap-3">
        <Image
          src={pillIconSrc}
          alt="Leaderboard Icon"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
        <h2 className="text-xl font-semibold">Leaderboard</h2>
      </div>

      {/* Wrapper qui scrolle (scrollbar toujours visible) + espace pour la barre */}
      <div
        className="max-h-96 overflow-y-auto pr-4 py-2"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.6) transparent",
        }}
      >
        <ul className="space-y-3">
          {extendedLeaders.map((l, i) => {
            const isActive = i === current;

            // 1/2/3 : or/argent/bronze
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
                  // espace gauche/droite pour que la barre ne colle pas et que les shadows respirent
                  "ml-1.5 mr-1 flex items-center justify-between gap-3 rounded-2xl px-5 py-3 cursor-pointer transition",
                  "border border-white/5 bg-[#141414]",
                  // uniquement des SHADOWS oranges (pas de couleurs pleines), hover = même effet que l'actif
                  isActive
                    ? "shadow-[0_0_6px_#FF6600,inset_0_0_2px_#FF6600]"
                    : "hover:shadow-[0_0_6px_#FF6600,inset_0_0_2px_#FF6600]",
                ].join(" ")}
              >
                {/* Rang + adresse */}
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="w-7 text-right font-extrabold"
                    style={{ color: rankColor }}
                  >
                    {i + 1}.
                  </span>
                  <span className="truncate text-base text-white/90">
                    {shortAddr(l.addr)}
                  </span>
                </div>

                {/* Score + icône pilule à droite */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-white/95">
                    {l.score.toLocaleString()}
                  </span>
                  <Image
                    src={pillRankSrc}
                    alt="rank pill"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bouton bas */}
      <button
        type="button"
        onClick={() => alert("Open Leaderboard")}
        className="mt-5 w-full rounded-2xl bg-[#FF6600] px-5 py-3 font-semibold text-white shadow-[0_4px_10px_rgba(255,102,0,.35)] hover:brightness-110 active:scale-[0.98] transition"
      >
        Open Leaderboard
      </button>

      {/* Scrollbar WebKit — fine et toujours visible */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
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
