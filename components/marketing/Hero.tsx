import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full flex min-h-[60vh] flex-col items-center justify-center py-24 text-center md:py-36 overflow-hidden">
      {/* Premium Background Loop (Luxury driving car at night) - Forced 100% viewport width */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover select-none pointer-events-none"
      >
        <source
          src="/videos/service-video-bg.mp4"
          type="video/mp4"
        />
      </video>

      {/* Luxury Overlay: lightweight screen to keep the video extremely bright and vivid */}
      <div className="absolute inset-0 z-10 bg-black/35" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/10 to-background" />
      <div className="absolute inset-0 z-10 bg-radial from-accent-gold/5 via-transparent to-transparent opacity-30" />

      {/* Centered card container with bright video and clean transparent text block */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground font-sans leading-tight max-w-3xl mx-auto">
            Luxury Budget Transportation — NYC Premium Chauffeur Service
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Experience unparalleled luxury ground transportation at a price that fits your budget.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/new"
              data-testid="hero-cta-book"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent-gold px-8 text-sm font-semibold uppercase tracking-wider text-background shadow-lg shadow-accent-gold/20 hover:bg-accent-gold/90 transition-all hover:scale-105 active:scale-95 mx-auto"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
