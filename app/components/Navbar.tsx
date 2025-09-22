"use client";
import Image from "next/image";
import * as React from "react";

function truncateAddress(addr?: string | null, head = 6, tail = 4) {
  if (!addr) return "";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export default function Navbar({
  onOpenAbout,
  connected,
  walletAddress,
  onDisconnect,
}: {
  onOpenAbout: () => void;
  connected: boolean;
  walletAddress?: string | null;
  onDisconnect?: () => void;
}) {
  const circle =
    "flex items-center justify-center rounded-full bg-zinc-800/70 border border-white/10 shadow-sm hover:bg-[#FF6600]/80 hover:text-white transition";
  const ovalBase =
    "flex items-center justify-center rounded-full h-12 px-6 text-sm font-semibold uppercase tracking-wide border transition";
  const ovalIdle =
    "bg-zinc-900 text-white border-white/10 hover:bg-[#FF6600] hover:text-white";
  const ovalActive =
    "bg-[#FF6600] text-white border-[#FF6600] shadow-[0_0_10px_#ff660055,0_0_24px_#ff660033]";

  return (
    <nav className="flex w-full items-center justify-between px-16 py-6">
      {/* left: logo + nav buttons */}
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

        {/* dashboard button (stays orange when connected) */}
        <a
          href="#"
          aria-current={connected ? "page" : undefined}
          className={`${ovalBase} ${connected ? ovalActive : ovalIdle}`}
        >
          Dashboard
        </a>

        {/* about button */}
        <button
          onClick={onOpenAbout}
          className={`${ovalBase} ${ovalIdle} cursor-pointer`}
        >
          What is OrangePill?
        </button>
      </div>

      {/* right: socials + wallet */}
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

        {/* wallet: icon when disconnected, full button to disconnect when connected */}
        {connected ? (
          <button
            type="button"
            onClick={onDisconnect}
            title="Disconnect"
            aria-label="Disconnect"
            className="
              group flex items-center gap-2
              h-10 pl-3 pr-2
              rounded-full border border-white/10
              bg-zinc-900 text-white
              transition active:scale-95
              hover:bg-[#FF6600] hover:border-[#FF6600]
              hover:shadow-[0_0_10px_#ff660055,0_0_24px_#ff660033]
              cursor-pointer
            "
          >
            <span className="text-xs font-mono">
              {truncateAddress(walletAddress)}
            </span>
            <Image
              src="/exit.png"
              alt="Disconnect"
              width={16}
              height={16}
              className="opacity-90 group-hover:opacity-100"
            />
          </button>
        ) : (
          <div className={`${circle} size-10`} aria-label="Wallet">
            <Image src="/wallet.svg" width={20} height={20} alt="" />
          </div>
        )}
      </div>
    </nav>
  );
}
