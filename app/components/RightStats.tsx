"use client";
import React from "react";
import Image from "next/image";

/* ---------- Composant principal ---------- */
export default function RightStats({
  nextBlock = 50,
  currentBlock = 49,
  globalPills = 12324,
  barImageSrc = "/bar.png", // image exportée (barre) bloc 1
  currentBlockImageSrc = "/block.png", // image décorative bloc 2
  pillRankSrc = "/rankpill.png", // pilule bloc 3
}: {
  nextBlock?: number;
  currentBlock?: number;
  globalPills?: number;
  barImageSrc?: string;
  currentBlockImageSrc?: string;
  pillRankSrc?: string;
}) {
  return (
    // plus d’espace entre les cartes pour éviter que les halos se marchent dessus
    <aside className="flex flex-col gap-6">
      {/* Bloc 1 */}
      {/* Bloc 1 */}
      <CardBase glow="orange">
        <p className="text-sm text-zinc-300">Next Pill Block:</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(nextBlock)}
        </p>

        <div className="mt-4 w-full">
          <ImageStripScroller
            src="/trackpill.png"
            stripWidth={24000}
            stripHeight={32}
            displayHeight={48}
          />
        </div>
      </CardBase>

      {/* Bloc 2 */}
      <CardBase glow="orange">
        <p
          className="text-xl font-semibold text-zinc-300"
          style={{ fontFamily: "Poppins" }}
        >
          Current Block:
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">
          {formatNumber(currentBlock)}
        </p>

        <Image
          src={currentBlockImageSrc}
          alt="current block icon"
          width={100}
          height={100}
          className="absolute bottom-3 right-3 object-contain opacity-85 pointer-events-none select-none"
          priority
        />
      </CardBase>

      {/* Bloc 3 */}
      <CardBase glow="white">
        <p
          className="text-xl font-semibold text-zinc-300"
          style={{ fontFamily: "Poppins" }}
        >
          Global Pills:
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-3xl font-extrabold tracking-tight">
            {formatNumber(globalPills)}
          </p>
          <Image
            src={pillRankSrc}
            alt="pill rank"
            width={256}
            height={256}
            className="w-16 h-16 pointer-events-none select-none"
            priority
          />
        </div>
      </CardBase>
    </aside>
  );
}

/* ---------- Building blocks ---------- */

// Aura floue douce + anneau coloré autour de la carte.
// Isolation pour que les blurs ne se mélangent pas entre cartes.
// --- CardBase : glow uniquement au hover, carte par carte ---
// --- CardBase : base glow réduit, hover fortement accentué (carte par carte) ---
function CardBase({
  children,
  glow = "orange",
}: {
  children: React.ReactNode;
  glow?: "orange" | "white";
}) {
  const isOrange = glow === "orange";
  const ringBase = isOrange ? "ring-[#FF66001f]" : "ring-white/20"; // base très discret
  const ringHover = isOrange ? "hover:ring-[#FF6600]" : "hover:ring-white/80";
  const auraColor = isOrange ? "#FF6600" : "#FFFFFF";
  const hoverShadow = isOrange
    ? "hover:shadow-[0_0_22px_#ff66004d,0_0_48px_#ff660026]"
    : "hover:shadow-[0_0_18px_#ffffff40,0_0_36px_#ffffff1f]";

  return (
    <div className="relative isolate">
      {/* La carte est la "peer" ; l'aura (en dessous) réagit à son hover */}
      <div
        className={[
          "relative h-48 rounded-xl bg-[#0c0c0c] p-6",
          "flex flex-col items-center justify-center text-center",
          "peer transition-all duration-300", // animations douces
          "ring-1",
          ringBase,
          ringHover,
          hoverShadow,
          "motion-safe:hover:-translate-y-0.5",
        ].join(" ")}
      >
        {children}
      </div>

      {/* Aura derrière la carte : faible au repos, forte au hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-10 blur-xl transition-opacity duration-300 peer-hover:opacity-30"
        style={{ background: auraColor, filter: "saturate(1.05)" }}
      />
    </div>
  );
}

/* ---------- Progress bar (image nette & large pour éviter le flou) ---------- */
function ProgressImageBar({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative w-full select-none">
      <Image
        src={imageSrc}
        alt="progress bar"
        width={2400} // source HD pour garder la netteté
        height={200}
        className="w-full h-8 object-cover pointer-events-none" // un peu plus haute pour être bien lisible
        priority
      />
    </div>
  );
}

/**
 * Scroller ultra simple d’une grande image horizontale.
 * - `src`: image longue exportée de Figma (toute la ligne)
 * - `stripWidth`/`stripHeight`: dimensions réelles de l’image
 * - `displayHeight`: hauteur d’affichage dans la carte (px)
 * - `rounded`, `bg`: look du conteneur
 */
function ImageStripScroller({
  src,
  stripWidth,
  stripHeight,
  displayHeight = 48,
  loop = false, // 👉 passe à true pour du scroll infini
}: {
  src: string;
  stripWidth: number;
  stripHeight: number;
  displayHeight?: number;
  loop?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [x, setX] = React.useState(0); // position horizontale virtuelle (px)
  const [vw, setVw] = React.useState(0); // largeur visible du conteneur

  // mesure la largeur du conteneur pour calculer les bornes
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setVw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = React.useCallback(
    (val: number) => {
      const max = Math.max(0, stripWidth - vw);
      return Math.min(Math.max(0, val), max);
    },
    [stripWidth, vw]
  );

  // drag (pointer events)
  const dragging = React.useRef(false);
  const startX = React.useRef(0);
  const startScroll = React.useRef(0);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = containerRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = x;
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    setX((prev) =>
      loop ? startScroll.current - dx : clamp(startScroll.current - dx)
    );
    e.preventDefault();
    e.stopPropagation();
  };

  const endDrag: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = containerRef.current;
    dragging.current = false;
    try {
      el?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // molette / trackpad (clampé ou infini)
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    // horizontal si dispo, sinon on utilise deltaY
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setX((prev) => (loop ? prev + delta : clamp(prev + delta)));
    e.preventDefault();
    e.stopPropagation();
  };

  // conteneur (aucun scroll natif → pas d’overscroll possible)
  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    touchAction: "pan-x",
    WebkitOverflowScrolling: "auto",
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "none",
  };

  if (!loop) {
    // --- MODE CLAMP: on translate l’unique image, bornée 0..max ---
    const trackStyle: React.CSSProperties = {
      width: `${stripWidth}px`,
      height: `${displayHeight}px`,
      transform: `translateX(-${x}px)`,
      willChange: "transform",
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full"
        style={containerStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <div className="relative" style={trackStyle}>
          <Image
            src={src}
            alt="Pill track"
            width={stripWidth}
            height={stripHeight}
            className="block h-full w-auto select-none pointer-events-none"
            priority
          />
        </div>
      </div>
    );
  }

  // --- MODE INFINI: on duplique l’image et on wrap avec modulo ---
  const norm = ((x % stripWidth) + stripWidth) % stripWidth; // offset [0..stripWidth)
  const copies = Math.max(3, Math.ceil(vw / stripWidth) + 2); // assez d’images pour couvrir

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={containerStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      <div className="relative" style={{ height: `${displayHeight}px` }}>
        {Array.from({ length: copies }).map((_, i) => {
          const left = i * stripWidth - norm - stripWidth; // commence une image “en amont”
          return (
            <Image
              key={i}
              src={src}
              alt={`Pill track ${i}`}
              width={stripWidth}
              height={stripHeight}
              className="absolute top-0 block h-full w-auto select-none pointer-events-none"
              style={{ left: `${left}px` }}
              priority={i < 2}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---------- utils ---------- */
const nf = new Intl.NumberFormat("en-US");
function formatNumber(n: number) {
  return nf.format(n);
}
