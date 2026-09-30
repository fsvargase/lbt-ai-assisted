import Link from "next/link";
import Image from "next/image";

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
          <h1 className="flex justify-center select-none pointer-events-none">
            <span className="sr-only">
              Luxury Budget Transportation — NYC Premium Chauffeur Service
            </span>
            <Image
              src="/logo_lbt.png"
              alt="Luxury Budget Transportation — NYC Premium Chauffeur Service"
              width={800}
              height={240}
              priority
              className="h-auto w-full max-w-[450px] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] object-contain"
            />
          </h1>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new"
              data-testid="hero-cta-book"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-accent-gold px-8 text-sm font-semibold uppercase tracking-wider text-background shadow-lg shadow-accent-gold/20 hover:bg-accent-gold/90 transition-all hover:scale-105 active:scale-95"
            >
              <svg
                className="mr-2 h-4 w-4 shrink-0 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book Now
            </Link>
            <a
              href="https://www.instagram.com/luxurybudgettransport/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-instagram"
              aria-label="Follow us at Instagram"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-transparent px-8 text-sm font-semibold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/10 transition-all hover:scale-105 active:scale-95"
            >
              <svg
                className="mr-2 h-4 w-4 shrink-0 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Follow Us At Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
