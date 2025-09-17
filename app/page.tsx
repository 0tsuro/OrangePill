"use client";
import React from "react";
import Image from "next/image";
import Leaderboard, { Leader } from "./components/Leaderboard";
import RankCard from "./components/RankCard";

/* ---------------------------------- DATA ---------------------------------- */
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
    <main className="h-dvh w-full bg-black text-white overflow-hidden text-sm">
      {/* MOBILE GATE */}
      <section className="flex h-dvh w-full items-center justify-center px-6 text-center lg:hidden">
        <div className="space-y-3">
          <h1 className="text-lg font-bold">Desktop Only</h1>
          <p className="text-zinc-300">pls use desktop</p>
        </div>
      </section>

      {/* DESKTOP UI */}
      <section className="hidden lg:flex flex-col h-full">
        <Navbar />

        {/* GRID */}
        <section
          className="
            grid flex-1 gap-3 px-12
            grid-cols-[clamp(200px,18vw,280px)_minmax(380px,1fr)_clamp(200px,18vw,280px)]
            w-full
          "
        >
          {/* LEFT – Leaderboard + Rank */}
          <aside className="flex flex-col gap-3">
            <Leaderboard leaders={leaders} activeIndex={4} />
            <RankCard myRank={5} />
          </aside>

          {/* CENTER – Cup */}
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="relative h-full w-full max-w-[520px]">
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
                  className="mb-5 rounded-lg bg-[#FF6600] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
                >
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                </button>
                <p className="text-xs text-zinc-300">
                  Connect Your Wallet to Claim Pills!
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT – Stats */}
          <aside className="space-y-2 rounded-lg border border-white/10 bg-zinc-900/40 p-3 flex flex-col">
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
                  <div className="h-3 w-3 rounded bg-zinc-700" />
                  <div className="h-4 w-3 rounded bg-zinc-600" />
                  <div className="h-5 w-3 rounded bg-zinc-500" />
                </div>
              }
            />
            <Card
              title="Global Pills:"
              value={globalPills.toLocaleString()}
              footer={
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF6600]" />
                  <span className="text-[9px] text-zinc-300">Live counter</span>
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
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-[#FF6600]/80 hover:text-white transition";
  const oval =
    "flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 shadow-sm hover:bg-[#FF6600] hover:text-white transition h-8 px-4 text-xs font-semibold uppercase tracking-wide";

  return (
    <nav className="hidden lg:flex w-screen items-center justify-between px-12 py-8">
      {/* GAUCHE */}
      <div className="flex items-center gap-3">
        <a href="#" className={`${circle} size-10`} aria-label="Home">
          <Image
            src="/orangepill.png"
            width={28}
            height={28}
            alt="OrangePill Logo"
            className="object-contain"
            priority
          />
        </a>
        <a href="#" className={`${oval} bg-[#FF6600] text-white`}>
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
      <div className="flex items-center gap-1.5">
        <a href="#" className={`${circle} size-8`}>
          <Image src="/discord.svg" width={14} height={14} alt="Discord" />
        </a>
        <a href="#" className={`${circle} size-8`}>
          <Image src="/x.svg" width={14} height={14} alt="X" />
        </a>
        <a href="#" className={`${circle} size-8`}>
          <Image src="/bell.svg" width={14} height={14} alt="Bell" />
        </a>
        <a href="#" className={`${circle} size-8`}>
          <Image src="/wallet.svg" width={14} height={14} alt="Wallet" />
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
        "border border-white/10 bg-zinc-900/40 p-2 rounded-lg flex-1 " +
        className
      }
    >
      <p className="text-[10px] text-zinc-400">{title}</p>
      <p className="mt-0.5 text-lg font-extrabold tracking-tight">{value}</p>
      {footer}
    </div>
  );
}

function BlocksTrail() {
  return (
    <div className="mt-0.5 flex items-center gap-1">
      <div className="h-2 w-4 rounded bg-zinc-700" />
      <div className="h-2 w-4 rounded bg-zinc-700" />
      <div className="h-2 w-4 rounded bg-zinc-700" />
      <div className="h-2 w-4 rounded bg-zinc-700" />
      <div className="h-2 w-4 rounded bg-[#FF6600]" />
    </div>
  );
}
