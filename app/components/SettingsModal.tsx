"use client";
import React from "react";

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-[420px] rounded-2xl border border-white/10 bg-[#1B1B1B] p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Transactions Settings</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        {/* Fee Rate input */}
        <label className="mb-4 block text-sm font-semibold text-white">
          Fee Rate (sat/vb)
          <input
            type="number"
            placeholder="e.g. 10"
            className="mt-2 w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#FF6600]"
          />
        </label>

        {/* Switch */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Fee Rate (sat/vb)</p>
            <p className="text-xs text-white/40">Lorem ipsum dolor sit amet…</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="h-5 w-9 rounded-full bg-zinc-700 peer-checked:bg-[#FF6600] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button className="rounded-lg bg-[#FF6600] py-2 font-bold text-white">
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="text-sm text-white/50 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
