"use client";
import React from "react";
import Image from "next/image";
import Leaderboard, { Leader } from "./components/Leaderboard";
import RankCard from "./components/RankCard";
import RightStats from "./components/RightStats";

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
    <main className="h-dvh w-full bg-black text-white overflow-hidden flex flex-col">
      {/* MOBILE GATE */}
      <section className="flex h-dvh w-full items-center justify-center px-6 text-center lg:hidden">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Desktop Only</h1>
          <p className="text-zinc-300">pls use desktop</p>
        </div>
      </section>

      {/* DESKTOP UI */}
      <section className="hidden lg:flex flex-col flex-1">
        <Navbar />

        {/* GRID */}
        <section
          className="
            grid flex-1 gap-4 px-14
            grid-cols-[clamp(240px,19vw,320px)_minmax(420px,1fr)_clamp(240px,19vw,320px)]
            items-center
          "
        >
          {/* LEFT – Leaderboard + Rank */}
          <aside className="flex flex-col gap-4 scale-[0.95]">
            <Leaderboard leaders={leaders} activeIndex={4} />
            <RankCard myRank={5} />
          </aside>

          {/* CENTER – Cup */}
          <div className="relative flex items-center justify-center scale-[0.95]">
            <div className="relative w-full max-w-[600px]">
              <Image
                src="/cup.png"
                alt="Cup"
                width={600}
                height={600}
                className="object-contain select-none pointer-events-none mx-auto"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button
                  onClick={() => setConnected((s) => !s)}
                  className="mb-5 rounded-lg bg-[#FF6600] px-6 py-3 text-lg font-bold text-white shadow-[0_4px_12px_rgba(255,102,0,.35)] transition active:scale-[0.98] hover:brightness-110"
                >
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                </button>
                <p className="text-base text-zinc-300">
                  Connect Your Wallet to Claim Pills!
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT – Stats */}
          <div className="scale-[0.95]">
            <RightStats
              nextBlock={nextBlock}
              currentBlock={currentBlock}
              globalPills={globalPills}
            />
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </section>
    </main>
  );
}

/* ------------------------------- NAVBAR ----------------------------------- */
function Navbar() {
  const circle =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-[#FF6600]/80 hover:text-white transition";
  const oval =
    "flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 shadow-sm hover:bg-[#FF6600] hover:text-white transition h-14 px-10 text-lg font-semibold uppercase tracking-wide";

  return (
    <nav className="hidden lg:flex w-screen items-center justify-between px-20 py-12">
      {/* GAUCHE */}
      <div className="flex items-center gap-8">
        <a href="#" className={`${circle} size-18`} aria-label="Home">
          <Image
            src="/orangepill.png"
            width={56}
            height={56}
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
      <div className="flex items-center gap-4">
        <a href="#" className={`${circle} size-12`}>
          <Image src="/discord.svg" width={24} height={24} alt="Discord" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/x.svg" width={24} height={24} alt="X" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/bell.svg" width={24} height={24} alt="Bell" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/wallet.svg" width={24} height={24} alt="Wallet" />
        </a>
      </div>
    </nav>
  );
}

/* ------------------------------- FOOTER ----------------------------------- */
function Footer() {
  return (
    <footer className="w-full bg-[#FF6600] text-black text-xs font-bold px-6 py-2 text-right">
      ORANGE PILL, 2025, ALL RIGHTS RESERVED
    </footer>
  );
}
