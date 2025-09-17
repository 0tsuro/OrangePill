"use client";
import * as React from "react";
import Image from "next/image";

export type LBItem = { addr: string; score: number };

type Props = {
  open: boolean;
  onClose: () => void;
  items: LBItem[]; // NOTE: backend list (addr, score)
  activeIndex?: number | null; // NOTE: optional preselected row (0-based)
  pillIconSrc?: string; // NOTE: right-side score icon
  headerIconSrc?: string; // NOTE: header left icon
};

const nf = new Intl.NumberFormat("en-US");
const fmt = (n: number) => nf.format(n);

export default function LeaderboardModal({
  open,
  onClose,
  items,
  activeIndex = null,
  pillIconSrc = "/rankpill.png",
  headerIconSrc = "/pillrank.png",
}: Props) {
  const [query, setQuery] = React.useState("");
  const [current, setCurrent] = React.useState<number | null>(activeIndex);

  React.useEffect(() => setCurrent(activeIndex ?? null), [activeIndex]);

  // NOTE: simple client filter by address (backend can replace this)
  const filtered = React.useMemo(() => {
    if (!query) return items;
    return items.filter((i) =>
      i.addr.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="absolute left-1/2 top-1/2 w-[min(900px,92vw)] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <Image
                src={headerIconSrc}
                alt="Leaderboard"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
              <h2 className="text-lg font-semibold">Leaderboard</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search address"
                  className="h-9 w-[260px] rounded-full bg-[#0F0F0F] pl-10 pr-4 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20 placeholder:text-zinc-500"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  fill="currentColor"
                >
                  <path d="M10 2a8 8 0 015.292 13.708l4 4-1.414 1.414-4-4A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
                </svg>
              </div>
              {/* Close */}
              <button
                onClick={onClose}
                className="grid size-7 place-items-center rounded-full bg-[#0F0F0F] text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* List container */}
          <div className="px-6 pb-6">
            <div className="relative rounded-xl bg-[#0F0F0F] ring-1 ring-white/10">
              {/* Scrollable list */}
              <div
                className="scrollwrap max-h-[440px] overflow-y-auto"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.6) transparent",
                  scrollbarGutter: "stable",
                }}
              >
                <ul className="divide-y divide-white/5">
                  {filtered.map((row, i) => {
                    const isActive = current === i;
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
                        key={`${row.addr}-${i}`}
                        onClick={() => setCurrent(i)}
                        className={[
                          "flex items-center gap-4 px-4 py-3 cursor-pointer",
                          isActive
                            ? "ring-1 ring-[#FF6600] shadow-[0_0_8px_#FF660040] rounded-lg mx-2 my-1 bg-[#121212]"
                            : "hover:bg-white/[0.03]",
                        ].join(" ")}
                      >
                        {/* Rank bubble */}
                        <div
                          className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
                          style={{ color: rankColor }}
                        >
                          {i + 1}.
                        </div>

                        {/* Address (truncate) */}
                        <div className="min-w-0 flex-1 truncate text-sm text-white/90">
                          {row.addr}
                        </div>

                        {/* Score + pill */}
                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-sm font-semibold">
                            {fmt(row.score)}
                          </span>
                          <Image
                            src={pillIconSrc}
                            alt="pill"
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

              {/* Always-visible slim “fake” scrollbar rail (for mac overlay) */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-1.5 top-1.5 bottom-1.5 w-[2px] rounded-full bg-white/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styled-jsx: WebKit scrollbar */}
      <style jsx>{`
        :global(.scrollwrap::-webkit-scrollbar) {
          width: 6px;
        }
        :global(.scrollwrap::-webkit-scrollbar-thumb) {
          background: rgba(255, 255, 255, 0.65);
          border-radius: 9999px;
        }
        :global(.scrollwrap::-webkit-scrollbar-track) {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
