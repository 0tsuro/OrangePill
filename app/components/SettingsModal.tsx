"use client";
import * as React from "react";
import Image from "next/image";

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-[#1F1F1F] p-8 shadow-[0_40px_120px_rgba(0,0,0,.6)]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-white/10">
              <Image src={"/settings.svg"} width={24} height={24} alt="" />
            </span>
            <h3 className="text-2xl font-extrabold">Transactions Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full"
          >
            <Image
              className="cursor-pointer"
              src={"/close.svg"}
              width={24}
              height={24}
              alt=""
            />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-white/80">Fee Rate (sat/vb)</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm outline-none ring-0"
              placeholder="…"
            />
            <p className="mt-2 text-xs text-white/50">
              Lorem ipsum dolor siamet,consecturelit, sed do eiusmod tempor
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141414] px-4 py-3">
            <div>
              <p className="text-sm">Fee Rate (sat/vb)</p>
              <p className="text-xs text-white/50">
                Lorem ipsum dolor siamet,consecturelit, sed do eiusmod tempor
              </p>
            </div>
            <button className="relative h-6 w-12 rounded-full bg-[#FF7A0F]">
              <span className="absolute left-6 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white transition" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="rounded-xl bg-[#FF7A0F] px-6 py-3 font-bold shadow-[0_10px_26px_rgba(255,122,15,.35)]">
              Save Settings
            </button>
            <button className="text-white/60">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
