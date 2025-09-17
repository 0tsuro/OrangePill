"use client";
import * as React from "react";
import Image from "next/image";

import Leaderboard, { type Leader } from "./components/Leaderboard";
import LeaderboardModal from "./components/LeaderboardModal"; // 👈 your GOOD modal
import RightStats from "./components/RightStats";
import Cup from "./components/Cup";
import RankCard from "./components/RankCard";
import SettingsModal from "./components/SettingsModal";

/* Fake data (same as before) */
const leaders: Leader[] = [
  { addr: "bc1p7w69r4jv...1", score: 1319 },
  { addr: "bc1p7w69r4jv...2", score: 999 },
  { addr: "bc1p7w69r4jv...3", score: 950 },
  { addr: "bc1p7w69r4jv...4", score: 850 },
  { addr: "bc1p7w69r4jv...5", score: 784 },
];

export default function Page() {
  const [connected, setConnected] = React.useState(false);

  const [leaderboardOpen, setLeaderboardOpen] = React.useState(false); // 👈 state for your good modal
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* MOBILE GATE */}
      <section className="flex h-dvh w-full items-center justify-center px-6 text-center lg:hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Desktop Only</h1>
          <p className="text-zinc-300">pls use desktop</p>
        </div>
      </section>

      {/* DESKTOP ONLY */}
      <section className="hidden h-full flex-col lg:flex">
        <Navbar />

        {/* GRID */}
        <section className="grid h-[calc(100dvh-120px)] w-full grid-cols-[clamp(240px,20vw,360px)_minmax(520px,1fr)_clamp(240px,20vw,360px)] items-center gap-4 px-14">
          {/* LEFT */}
          <aside className="flex flex-col gap-4">
            <Leaderboard
              leaders={leaders}
              activeIndex={4}
              onOpen={() => setLeaderboardOpen(true)} // 👈 wire the CTA
            />
            <RankCard myRank={5} />
          </aside>

          {/* CENTER */}
          <Cup
            connected={connected}
            onToggleConnect={() => setConnected((s) => !s)}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          {/* RIGHT */}
          <aside className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-3">
            <RightStats
              nextBlock={50}
              currentBlock={49}
              globalPills={12324}
              barImageSrc="/bar.png"
              currentBlockImageSrc="/block.png"
              pillRankSrc="/rankpill.png"
            />
          </aside>
        </section>

        {/* FOOTER */}
        <footer className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-10 bg-[#FF7A0F]" />
          <div className="flex h-6 items-center justify-end bg-[#1E1E1E] pr-6 text-[10px] font-bold tracking-wide text-black">
            ORANGE PILL, 2025, ALL RIGHTS RESERVED
          </div>
        </footer>
      </section>

      {/* MODALS */}
      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        leaders={leaders}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}

/* -------------------------------- NAVBAR --------------------------------- */
function Navbar() {
  const circle =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-[#FF6600]/80 hover:text-white transition";
  const oval =
    "flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 shadow-sm hover:bg-[#FF6600] hover:text-white transition h-12 px-6 text-sm font-semibold uppercase tracking-wide";

  return (
    <nav className="flex w-full items-center justify-between px-16 py-6">
      {/* LEFT: logo + nav buttons */}
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

      {/* RIGHT: round icons */}
      <div className="flex items-center gap-2">
        <a href="#" className={`${circle} size-10`} aria-label="Discord">
          <Image src="/discord.svg" width={20} height={20} alt="" />
        </a>
        <a href="#" className={`${circle} size-10`} aria-label="X">
          <Image src="/x.svg" width={20} height={20} alt="" />
        </a>
        <a href="#" className={`${circle} size-10`} aria-label="Bell">
          <Image src="/bell.svg" width={20} height={20} alt="" />
        </a>
        <a href="#" className={`${circle} size-10`} aria-label="Wallet">
          <Image src="/wallet.svg" width={20} height={20} alt="" />
        </a>
      </div>
    </nav>
  );
}
