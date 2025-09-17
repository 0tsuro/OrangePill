"use client";
import React from "react";
import Image from "next/image";

import Leaderboard, { Leader } from "./components/Leaderboard";
import RankCard from "./components/RankCard";
import RightStats from "./components/RightStats";
import Cup from "./components/Cup";
import SettingsModal from "./components/SettingsModal"; // <= modal settings (blur)

const baseLeaders: Leader[] = [
  { addr: "bc1p7w69r4jv...1", score: 1319 },
  { addr: "bc1p7w69r4jv...2", score: 999 },
  { addr: "bc1p7w69r4jv...3", score: 950 },
  { addr: "bc1p7w69r4jv...4", score: 850 },
  { addr: "bc1p7w69r4jv...5", score: 784 },
];

export default function Page() {
  const [connected, setConnected] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false); // <-- FIX

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
      <section className="hidden lg:flex flex-1 flex-col">
        <Navbar />

        <section className="grid flex-1 items-center gap-4 px-14 grid-cols-[clamp(220px,18vw,300px)_minmax(380px,1fr)_clamp(220px,18vw,300px)]">
          {/* LEFT */}
          <aside className="flex flex-col gap-4 scale-[0.9]">
            <Leaderboard leaders={baseLeaders} activeIndex={4} />
            <RankCard myRank={5} />
          </aside>

          {/* CENTER – CUP */}
          <div className="relative flex items-center justify-center scale-[0.9]">
            <Cup
              connected={connected}
              onToggleConnect={() => setConnected((s) => !s)}
              onOpenSettings={() => setSettingsOpen(true)} // <-- open modal
              initialPills={784}
              cupSrc="/cup.png"
              pillSrc="/rankpill.png"
            />
          </div>

          {/* RIGHT */}
          <div className="scale-[0.9]">
            <RightStats
              nextBlock={nextBlock}
              currentBlock={currentBlock}
              globalPills={globalPills}
            />
          </div>
        </section>

        <Footer />
      </section>

      {/* SETTINGS MODAL (blur backdrop inside the component) */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}

/* ------------------------------- NAVBAR ----------------------------------- */
function Navbar() {
  const circle =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm transition hover:bg-[#FF6600]/80 hover:text-white";
  const oval =
    "flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 shadow-sm h-16 px-8 text-base font-semibold uppercase tracking-wide transition hover:bg-[#FF6600] hover:text-white";

  return (
    <nav className="hidden lg:flex w-screen items-center justify-between px-20 py-10">
      <div className="flex items-center gap-6">
        <a href="#" className={`${circle} size-16`} aria-label="Home">
          <Image
            src="/orangepill.png"
            width={48}
            height={48}
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
      <div className="flex items-center gap-3">
        <a href="#" className={`${circle} size-12`}>
          <Image src="/discord.svg" width={22} height={22} alt="Discord" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/x.svg" width={22} height={22} alt="X" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/bell.svg" width={22} height={22} alt="Bell" />
        </a>
        <a href="#" className={`${circle} size-12`}>
          <Image src="/wallet.svg" width={22} height={22} alt="Wallet" />
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
