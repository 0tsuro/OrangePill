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

  return (
    <main className="h-dvh w-full bg-black text-white overflow-hidden">
      {/* MOBILE GATE */}
      <section className="flex h-dvh w-full items-center justify-center px-6 text-center lg:hidden">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Desktop Only</h1>
          <p className="text-zinc-300">pls use desktop</p>
        </div>
      </section>

      {/* DESKTOP UI */}
      {/* DESKTOP UI */}
      <section className="hidden lg:flex flex-col h-full">
        <Navbar />

        {/* GRID */}
        <section
          className="
      grid flex-1 gap-4 px-16
      grid-cols-[clamp(260px,20vw,360px)_minmax(480px,1fr)_clamp(260px,20vw,360px)]
      w-full
    "
        >
          {/* LEFT – Leaderboard */}
          <aside className="rounded-r-2xl border border-white/10 bg-zinc-900/40 p-4 flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <IconTrophy />
              <h2 className="text-lg font-semibold">Leaderboard</h2>
            </div>
            <ul className="space-y-1 flex-1 overflow-hidden">
              {leaders.map((l, i) => (
                <li
                  key={l.addr}
                  className="flex items-center justify-between gap-2 rounded-xl bg-zinc-800/50 px-3 py-1.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 text-right text-zinc-400">
                      {i + 1}.
                    </span>
                    <span className="truncate text-xs">{l.addr}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">
                      {l.score.toLocaleString()}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* CENTER – Cup */}
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="relative h-full w-full max-w-[700px]">
              <Image
                src="/cup.png"
                alt="Cup"
                fill
                className="object-contain select-none pointer-events-none"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button
                  onClick={() => setConnected((s) => !s)}
                  className="mb-8 rounded-xl bg-orange-500 px-6 py-3 text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
                >
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                </button>
                <div>
                  <h1>Connect Your Wallet to Claim Pills!</h1>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – Stats */}
          <aside className="space-y-3 rounded-l-2xl border border-white/10 bg-zinc-900/40 p-4 flex flex-col">
            <Card
              title="Next Pill Block:"
              value={nextBlock}
              footer={<BlocksTrail />}
            />
            <Card
              title="Current Block:"
              value={currentBlock}
              footer={
                <div className="mt-1 flex items-end gap-1">
                  <div className="h-4 w-4 rounded bg-zinc-700" />
                  <div className="h-6 w-4 rounded bg-zinc-600" />
                  <div className="h-8 w-4 rounded bg-zinc-500" />
                </div>
              }
            />
            <Card
              title="Global Pills:"
              value={globalPills.toLocaleString()}
              footer={
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2 py-0.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] text-zinc-300">
                    Live counter
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
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-zinc-700/70 transition h-10 px-5 text-sm font-semibold uppercase tracking-wide";

  return (
    <nav className="hidden lg:flex w-screen items-center justify-between px-16 py-12">
      {/* GAUCHE */}
      <div className="flex items-center gap-4">
        <a href="#" className={`${circle} size-14`} aria-label="Home">
          <Image
            src="/orangepill.png"
            width={40}
            height={40}
            alt="OrangePill Logo"
            className="object-contain"
            priority
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

      {/* DROITE */}
      <div className="flex items-center gap-2">
        <a href="#" className={`${circle} size-10`}>
          <Image src="/discord.svg" width={20} height={20} alt="Discord" />
        </a>
        <a href="#" className={`${circle} size-10`}>
          <Image src="/x.svg" width={20} height={20} alt="X" />
        </a>
        <a href="#" className={`${circle} size-10`}>
          <Image src="/bell.svg" width={20} height={20} alt="Bell" />
        </a>
        <a href="#" className={`${circle} size-10`}>
          <Image src="/wallet.svg" width={20} height={20} alt="Wallet" />
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
        "border border-white/10 bg-zinc-900/40 p-3 rounded-2xl flex-1 " +
        className
      }
    >
      <p className="text-xs text-zinc-400">{title}</p>
      <p className="mt-0.5 text-2xl font-extrabold tracking-tight">{value}</p>
      {footer}
    </div>
  );
}

function BlocksTrail() {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="h-3 w-5 rounded bg-zinc-700" />
      <div className="h-3 w-5 rounded bg-zinc-700" />
      <div className="h-3 w-5 rounded bg-zinc-700" />
      <div className="h-3 w-5 rounded bg-zinc-700" />
      <div className="h-3 w-5 rounded bg-orange-500" />
    </div>
  );
}

/* --------------------------------- ICONS ---------------------------------- */

function IconTrophy() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-orange-500"
      fill="currentColor"
    >
      <path d="M6 2h12v2h3v3a5 5 0 0 1-5 5h-1a5 5 0 0 1-4 2 5 5 0 0 1-4-2H6A5 5 0 0 1 1 7V4h5V2zm-3 4v1a3 3 0 0 0 3 3h1V6H3zm18 0h-4v4h1a3 3 0 0 0 3-3V6zM10 14h4a4 4 0 0 1-4 3 4 4 0 0 1-4-3h4zM8 18h8v2H8z" />
    </svg>
  );
}
