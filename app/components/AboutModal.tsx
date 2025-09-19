"use client";
import * as React from "react";
import Image from "next/image";

export default function AboutModal({
  open,
  onClose,
  iconSrc = "/orangepill.png",
}: {
  open: boolean;
  onClose: () => void;
  iconSrc?: string;
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
      <button
        aria-label="Close about"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Panel */}
      <div
        className={`
          relative w-[min(900px,92vw)] rounded-3xl border border-white/10
          bg-[#1B1B1B] p-6 shadow-[0_40px_120px_rgba(0,0,0,.6)]
          transition-all duration-200
          ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }
        `}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={iconSrc} alt="" width={40} height={40} />
            <h3 className="text-xl font-extrabold">What is Orange Pill?</h3>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center cursor-pointer"
            aria-label="Close"
          >
            <Image src={"/close.svg"} width={24} height={24} alt="" />
          </button>
        </div>

        {/* Body (scrollable si besoin) */}
        <div className="max-h-[65vh] overflow-y-auto pr-2 p-4">
          {/* Section 1 */}
          <h4 className="mb-2 text-center text-lg font-extrabold p-4">
            Lorem Ipsum Dolor Sit
          </h4>
          <p
            className="mx-auto mb-6 max-w-3xl text-center text-sm text-zinc-200 "
            style={{ fontFamily: "Poppins" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Section 2 */}
          <h4 className="mb-2 text-center text-lg font-extrabold p-4">
            Lorem Ipsum Dolor Sit
          </h4>
          <p
            className="mx-auto mb-6 max-w-3xl text-center text-sm text-zinc-200"
            style={{ fontFamily: "Poppins" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate veli <br /> <br />
            Lesse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>

          {/* CTA centered */}
          <div className="mb-2 flex justify-center p-4">
            <a
              href="#"
              className="
                inline-flex items-center gap-2 rounded-xl bg-[#FF7A0F]
                px-4 py-2 text-sm font-bold text-white
                shadow-[0_10px_26px_rgba(255,122,15,.35)]
                hover:brightness-110 active:scale-[0.98] transition
              "
            >
              View Announcements
              <Image src={"/view.svg"} width={16} height={16} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
