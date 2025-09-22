"use client";
import * as React from "react";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function RankCard({
  myRank = 5,
  connected,
}: {
  myRank?: number;
  connected: boolean;
}) {
  // simple: compact top spacing on some screens
  const [compactTop, setCompactTop] = React.useState(false);
  const [padClass, setPadClass] = React.useState("p-5");

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isWindowed24 = w === 1440 && (h === 800 || h === 900);

      // simple: sync padding with Leaderboard
      setPadClass(isWindowed24 ? "p-4 pb-5" : "p-5");

      // simple: compact if 24" windowed or flat screens
      const compact =
        isWindowed24 || (w >= 1280 && w <= 1600 && h <= 900) || h <= 820;
      setCompactTop(compact);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className={[
        "w-full rounded-2xl border border-white/10 bg-[#1B1B1B]",
        padClass,
      ].join(" ")}
      style={{ marginTop: compactTop ? "-8px" : undefined }}
    >
      {/* header */}
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white/80"
          fill="currentColor"
        >
          <path d="M3 4h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z" />
        </svg>
        <p className="text-base font-semibold">Your Rank:</p>
        {!connected && (
          <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/10">
            Locked
          </span>
        )}
      </div>

      {connected ? (
        // show rank when connected
        <p className="text-6xl font-extrabold leading-none tracking-tight text-white">
          {ordinal(myRank).toUpperCase()}
        </p>
      ) : (
        <>
          {/* placeholder when not connected */}
          <div className="h-12 w-40 rounded-lg bg-white/5 ring-1 ring-white/10" />
          <p className="mt-3 text-sm text-zinc-400">
            Connect your wallet in the bottle to view your rank.
          </p>
        </>
      )}
    </div>
  );
}
