"use client";

import * as React from "react";
import Image from "next/image";

import Navbar from "./components/Navbar";
import Leaderboard, { type Leader } from "./components/Leaderboard";
import LeaderboardModal from "./components/LeaderboardModal";
import RightStats from "./components/RightStats";
import Cup from "./components/Cup";
import RankCard from "./components/RankCard";
import SettingsModal from "./components/SettingsModal";
import AboutModal from "./components/AboutModal";

/* ------------------------------- Fake data ------------------------------- */
const leaders: Leader[] = [
  { addr: "bc1p7w69r4jv...1", score: 1319 },
  { addr: "bc1p7w69r4jv...2", score: 999 },
  { addr: "bc1p7w69r4jv...3", score: 950 },
  { addr: "bc1p7w69r4jv...4", score: 850 },
  { addr: "bc1p7w69r4jv...5", score: 784 },
  { addr: "bc1extra001", score: 700 },
  { addr: "bc1extra002", score: 650 },
];

export default function Page() {
  const [connected, setConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

  const [leaderboardOpen, setLeaderboardOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const handleToggleConnect = () => {
    setConnected((prev) => {
      const next = !prev;
      // Adresse factice pour la démo
      setWalletAddress(next ? "bc1p7w69r4jv0xyzq9...h3a" : null);
      return next;
    });
  };

  return (
    <main className="relative h-dvh w-full overflow-y-auto bg-black text-white lg:overflow-hidden">
      {/* ============================== MOBILE ============================== */}
      <section className="lg:hidden">
        {/* Header mobile (centré) */}
        <header className="px-6 pt-8 pb-4 text-center">
          <h1 className="text-3xl font-extrabold">Orange Pill</h1>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[#FF7A0F]" />
        </header>

        {/* Banner: take the pill on PC */}
        <div className="px-4">
          <DesktopBannerCTA />
        </div>

        {/* Cartes */}
        <div className="space-y-4 px-4 pb-24 pt-4">
          <GlowCard color="white">
            <p className="text-sm text-zinc-400">Next Pill Block</p>
            <p className="mt-1 text-2xl font-extrabold text-[#FF7A0F]">
              5 <span className="font-bold">blocks</span>
            </p>
          </GlowCard>

          <GlowCard color="white">
            <p className="text-sm text-zinc-400">Current Block</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              915,586
            </p>
          </GlowCard>

          <GlowCard color="white">
            <p className="text-sm text-zinc-400">Global Pills</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-3xl font-extrabold tracking-tight">10,367</p>
              <Image
                src="/orangepill.png"
                alt="pill"
                width={48}
                height={48}
                className="pointer-events-none select-none"
                priority
              />
            </div>
          </GlowCard>

          <NotificationsCard />
        </div>

        {/* mini footer bar orange */}
        <footer className="fixed inset-x-0 bottom-0 h-6 bg-[#FF7A0F]" />
      </section>

      {/* ============================== DESKTOP ============================= */}
      <section className="hidden h-full flex-col lg:flex">
        <Navbar
          onOpenAbout={() => setAboutOpen(true)}
          connected={connected}
          walletAddress={walletAddress ?? undefined}
          onDisconnect={() => {
            setConnected(false);
            setWalletAddress(null);
          }}
        />

        {/* GRID (one-screen, no scroll) */}
        <section
          className="
            grid h-[calc(100dvh-120px)] w-full
            grid-cols-[clamp(240px,20vw,360px)_minmax(520px,1fr)_clamp(240px,20vw,360px)]
            items-center gap-4 px-14
          "
        >
          {/* LEFT */}
          <aside className="flex flex-col gap-4">
            <Leaderboard
              leaders={leaders}
              activeIndex={4}
              onOpen={() => setLeaderboardOpen(true)}
            />
            <RankCard myRank={5} connected={connected} />
          </aside>

          {/* CENTER (Cup) */}
          <Cup
            connected={connected}
            onToggleConnect={handleToggleConnect}
            onOpenSettings={() => setSettingsOpen(true)}
            // showYourPillsTitle={true} // si tu veux afficher l'image de titre interne
          />

          {/* RIGHT (stats inside a container bg) */}
          <aside className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-3">
            <RightStats
              nextBlock={50}
              currentBlock={49}
              globalPills={12324}
              barImageSrc="/bar.png"
              currentBlockImageSrc="/block.png"
              pillRankSrc="/orangepill.png"
            />
          </aside>
        </section>

        {/* FOOTER */}
        <footer className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="flex h-6 items-center justify-end bg-[#FF7A0F] pr-6 text-[10px] font-bold tracking-wide text-black">
            ORANGE PILL, 2025, ALL RIGHTS RESERVED
          </div>
        </footer>
      </section>

      {/* ================================ MODALS =============================== */}
      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        leaders={leaders}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}

/* ------------------------------ GlowCard (mobile) ------------------------------ */
function GlowCard({
  children,
  color = "orange",
  className = "",
}: {
  children: React.ReactNode;
  color?: "orange" | "white";
  className?: string;
}) {
  const isOrange = color === "orange";
  const auraColor = isOrange ? "#FF6600" : "#FFFFFF";

  const ringBase = isOrange ? "ring-[#FF66001f]" : "ring-white/20";
  const ringHover = isOrange
    ? "hover:ring-[#FF6600]/80"
    : "hover:ring-white/90";

  const baseShadow = isOrange
    ? "shadow-[0_0_12px_#ff660026,0_0_28px_#ff660014]"
    : "shadow-[0_0_10px_#ffffff22,0_0_22px_#ffffff10]";

  const hoverShadow = isOrange
    ? "hover:shadow-[0_0_24px_#ff66004d,0_0_52px_#ff66002e]"
    : "hover:shadow-[0_0_20px_#ffffff4d,0_0_44px_#ffffff26]";

  return (
    <div className={`relative isolate ${className}`}>
      <div
        className={[
          "relative rounded-2xl bg-[#1B1B1B] p-5",
          "ring-1",
          ringBase,
          ringHover,
          baseShadow,
          hoverShadow,
          "transition-all duration-300 motion-safe:hover:-translate-y-0.5",
        ].join(" ")}
      >
        {children}
      </div>

      {/* Aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl opacity-20 blur-xl transition-opacity duration-300"
        style={{ background: auraColor, filter: "saturate(1.06)" }}
      />
    </div>
  );
}

/* ------------------------ DesktopBannerCTA (mobile) ------------------------ */
function DesktopBannerCTA() {
  const [copied, setCopied] = React.useState(false);
  const href =
    typeof window !== "undefined"
      ? window.location.href
      : "https://orangepill.fun";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <GlowCard color="orange" className="border border-white/1">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#FF7A0F]/15 ring-1 ring-[#FF7A0F]/30">
          <Image src="/desktop.png" width={28} height={28} alt="" />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold">
            For the full experience, take the pill on{" "}
            <span className="text-[#FF7A0F]">desktop</span>.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={copy}
              className="rounded-full bg-[#FF7A0F] px-3 py-1.5 text-sm font-semibold text-black ring-1 ring-black/10 transition hover:brightness-95 active:scale-[0.98]"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

/* --------------------------- NotificationsCard (mobile) --------------------------- */
function NotificationsCard() {
  return (
    <GlowCard color="white" className="mt-2">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#FF7A0F]/15 ring-1 ring-white/10">
          <Image src="/bell.svg" width={16} height={16} alt="" />
        </div>
        <p className="text-base font-semibold">Enable Notifications</p>
      </div>

      <div className="mt-4 space-y-3 text-sm text-zinc-300">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Open this site in <span className="font-semibold">Safari</span>
          </li>
          <li className="flex items-start gap-1">
            <span className="mt-0.5">Tap the</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs ring-1 ring-white/10">
              <Image src="/share.svg" width={12} height={12} alt="" />
              Share
            </span>
            <span className="mt-0.5">button</span>
          </li>
          <li>
            Select{" "}
            <span className="rounded-full bg-[#FF7A0F]/20 px-2 py-0.5 text-xs font-semibold text-[#FF7A0F] ring-1 ring-[#FF7A0F]/30">
              Add to Home Screen
            </span>
          </li>
        </ol>

        <div className="mt-2 rounded-xl bg-black/30 p-3 text-xs text-zinc-400 ring-1 ring-white/10">
          <span className="font-semibold">Note:</span> This feature is not
          available in Chrome or other iOS browsers.
        </div>
      </div>
    </GlowCard>
  );
}
