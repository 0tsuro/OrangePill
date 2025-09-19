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
  return (
    <div
      className={`
        fixed inset-0 z-[80] flex items-center justify-center
        transition-opacity duration-200
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Panel (animé) */}
      <div
        className={`
          relative w-[min(720px,92vw)] rounded-3xl border border-white/15
          bg-[#1F1F1F] p-8 shadow-[0_40px_120px_rgba(0,0,0,.6)]
          transition-all duration-200
          ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }
        `}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-white/10">
              <Image src={"/settings.svg"} width={24} height={24} alt="" />
            </span>
            <h3 className="text-2xl font-semibold">Transactions Settings</h3>
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
            <label
              className="text-sm text-white/80 ml-4"
              style={{ fontFamily: "Poppins" }}
            >
              Fee Rate (sat/vb)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm outline-none ring-0"
              placeholder="…"
              style={{ fontFamily: "Poppins" }}
            />
            <p className="mt-2 text-xs text-white/50">
              Lorem ipsum dolor siamet,consecturelit, sed do eiusmod tempor
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141414] px-4 py-3">
            <div>
              <p className="text-sm" style={{ fontFamily: "Poppins" }}>
                Fee Rate (sat/vb)
              </p>
              <p className="text-xs text-white/50">
                Lorem ipsum dolor siamet,consecturelit, sed do eiusmod tempor
              </p>
            </div>
            <button className="relative h-6 w-12 rounded-full bg-[#FF7A0F]">
              <span className="absolute left-6 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white transition" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              className="
    cursor-pointer rounded-xl bg-[#FF7A0F] px-6 py-3 font-bold
    shadow-[0_10px_26px_rgba(255,122,15,.35)]
    transition-all duration-300
    hover:shadow-[0_0_14px_#ff7a0fcc,0_0_28px_#ff7a0f99]
  "
            >
              Save Settings
            </button>

            <button
              className="text-white/60 cursor-pointer transform hover:text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
