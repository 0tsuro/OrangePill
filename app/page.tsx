"use client";
import React from "react";
import Image from "next/image";

/* ---------------------------------- DATA ---------------------------------- */

type Leader = { addr: string; score: number };

const leaders: Leader[] = [
  { addr: "bc1p7w69r4jv...1", score: 1319 },
  { addr: "bc1p7w69r4jv...2", score: 999 },
  { addr: "bc1p7w69r4jv...3", score: 950 },
  { addr: "bc1p7w69r4jv...4", score: 850 },
  { addr: "bc1p7w69r4jv...5", score: 784 },
];

/* --------------------------------- PAGE ----------------------------------- */

export default function Page() {
  const [connected, setConnected] = React.useState(false);
  const nextBlock = 50;
  const currentBlock = 49;
  const globalPills = 12324;
  // const myRank = 5; // (si tu l’utilises plus tard)

  return (
    <main className="min-h-dvh w-full bg-black text-white">
      {/* MOBILE GATE */}
      <section className="flex h-dvh w-full items-center justify-center px-6 text-center lg:hidden">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Desktop Only</h1>
          <p className="text-zinc-300">pls use desktop</p>
        </div>
      </section>

      {/* DESKTOP UI */}
      <section className="hidden lg:block">
        <Navbar />

        {/* GRID */}
        <section
          className="
            grid w-screen gap-6 px-0 pb-20
            grid-cols-[clamp(320px,22vw,420px)_minmax(640px,1fr)_clamp(320px,22vw,420px)]
            xl:gap-8
          "
        >
          {/* LEFT – Leaderboard */}
          <aside className="rounded-r-3xl rounded-l-none border border-white/10 bg-zinc-900/40 p-6">
            <div className="mb-5 flex items-center gap-3">
              <IconTrophy />
              <h2 className="text-2xl font-semibold">Leaderboard</h2>
            </div>
            <ul className="space-y-3">
              {leaders.map((l, i) => (
                <li
                  key={l.addr}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-800/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-right text-zinc-400">
                      {i + 1}.
                    </span>
                    <span className="truncate text-base">{l.addr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {l.score.toLocaleString()}
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* CENTER – Wallet */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/30 p-10">
            <div className="relative mb-10 h-[460px] w-full max-w-[760px]">
              <div className="absolute inset-x-0 top-0 h-10 rounded-t-full bg-zinc-800/80" />
              <div className="absolute inset-0 top-8 rounded-b-[48px] rounded-t-[16px] bg-zinc-800/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]" />
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <button
                  onClick={() => setConnected((s) => !s)}
                  className="rounded-2xl bg-orange-500 px-8 py-4 text-2xl font-extrabold text-black shadow-[0_10px_26px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
                >
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                </button>
              </div>
            </div>
            <p className="text-center text-base text-zinc-300">
              {connected
                ? "You can now claim pills."
                : "Connect Your Wallet to Claim Pills!"}
            </p>
          </div>

          {/* RIGHT – Stats */}
          <aside className="space-y-5 rounded-l-3xl rounded-r-none">
            <Card
              title="Next Pill Block:"
              value={nextBlock}
              footer={<BlocksTrail activeIndex={4} />}
            />
            <Card
              title="Current Block:"
              value={currentBlock}
              footer={
                <div className="mt-3 flex items-end gap-1.5">
                  <div className="h-7 w-7 rounded bg-zinc-700" />
                  <div className="h-10 w-7 rounded bg-zinc-600" />
                  <div className="h-12 w-7 rounded bg-zinc-500" />
                </div>
              }
            />
            <Card
              title="Global Pills:"
              value={globalPills.toLocaleString()}
              footer={
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-sm text-zinc-300">
                    Live counter (mock)
                  </span>
                </div>
              }
            />
          </aside>
        </section>
      </section>
    </main>
  );
}

/* ------------------------------- NAVBAR ----------------------------------- */

function Navbar() {
  const circle =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-zinc-700/70 transition";
  const oval =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-zinc-700/70 transition h-12 px-6 text-sm font-semibold uppercase tracking-wide";

  return (
    <nav className="hidden w-screen items-center justify-between gap-6 px-8 py-6 lg:flex">
      {/* GAUCHE : logo + boutons ovales */}
      <div className="flex items-center gap-4">
        <a href="#" className={`${circle} size-16`} aria-label="Home">
          <Image
            src="/orangepill.png"
            width={50}
            height={50}
            alt="OrangePill Logo"
            className="h-8 w-8 object-contain"
          />
        </a>
        <a href="#" className={oval}>
          Dashboard
        </a>
        <a href="#what" className={oval}>
          What is OrangePill
        </a>
        <a
          href="https://ordinals.com/"
          target="_blank"
          rel="noreferrer"
          className={oval}
        >
          OrdiScan
        </a>
      </div>

      {/* DROITE : 4 ronds icônes */}
      <div className="flex items-center gap-3">
        <a href="#" className={`${circle} size-12`}>
          <Image
            src="/discord.svg"
            width={50}
            height={50}
            alt=""
            className="h-5 w-5 object-contain"
          />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image
            width={50}
            height={50}
            src="/x.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image
            width={50}
            height={50}
            src="/bell.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image
            width={50}
            height={50}
            src="/wallet.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
        </a>
      </div>
    </nav>
  );
}

/* ------------------------------- COMPONENTS -------------------------------- */

function Card({
  title,
  value,
  footer,
  className = "",
}: {
  title: string;
  value: number | string;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "border border-white/10 bg-zinc-900/40 p-6 rounded-3xl " + className
      }
    >
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-1 text-5xl font-extrabold tracking-tight">{value}</p>
      {footer}
    </div>
  );
}

function BlocksTrail({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-5 w-8 rounded bg-zinc-700" />
      ))}
      <div
        className="h-5 w-8 rounded bg-orange-500"
        aria-label="next pill block"
      />
    </div>
  );
}

/* --------------------------------- ICONS ---------------------------------- */

function IconTrophy() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-orange-500"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 2h12v2h3v3a5 5 0 0 1-5 5h-1a5 5 0 0 1-4 2 5 5 0 0 1-4-2H6A5 5 0 0 1 1 7V4h5V2zm-3 4v1a3 3 0 0 0 3 3h1V6H3zm18 0h-4v4h1a3 3 0 0 0 3-3V6zM10 14h4a4 4 0 0 1-4 3 4 4 0 0 1-4-3h4zM8 18h8v2H8z" />
    </svg>
  );
}
