"use client";

import { useState } from "react";
import Link from "next/link";
import { MobileMenu } from "./MobileMenu"; // Import client-side mobile menu

interface SiteHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine dynamic dashboard/portal link based on role
  const isOperator = user?.role === "OPERATOR" || user?.role === "ADMIN";
  const isDriver = user?.role === "DRIVER";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Brand Mark */}
        <Link
          href="/"
          data-testid="nav-link-home"
          className="text-lg font-semibold tracking-wide text-foreground transition hover:text-accent-gold"
        >
          Luxury Budget Transportation
        </Link>

        {/* Desktop inline links */}
        <nav aria-label="Desktop" className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/#services"
            data-testid="nav-link-services"
            className="text-muted hover:text-foreground transition"
          >
            Services
          </Link>
          <Link
            href="/#fleet"
            data-testid="nav-link-fleet"
            className="text-muted hover:text-foreground transition"
          >
            Our Fleet
          </Link>
          <Link
            href="/#contact"
            data-testid="nav-link-contact"
            className="text-muted hover:text-foreground transition"
          >
            Contact
          </Link>

          {isOperator && (
            <Link
              href="/dashboard/bookings"
              data-testid="nav-link-operator"
              className="text-muted hover:text-accent-gold transition"
            >
              Dashboard
            </Link>
          )}

          {isDriver && (
            <Link
              href="/driver/trips"
              data-testid="nav-link-driver"
              className="text-muted hover:text-accent-gold transition"
            >
              Driver Portal
            </Link>
          )}

          {user ? (
            <Link
              href="/bookings"
              data-testid="nav-link-bookings"
              className="text-muted hover:text-foreground transition"
            >
              My Bookings
            </Link>
          ) : (
            <Link
              href="/signin"
              data-testid="nav-link-signin"
              className="text-muted hover:text-foreground transition"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/new"
            data-testid="nav-link-book"
            className="rounded-lg bg-accent-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:bg-accent-gold/90 transition-all active:scale-95"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu-panel"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          data-testid="nav-menu-toggle"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-800 text-foreground transition-all hover:bg-surface md:hidden"
        >
          <svg
            className="h-5 w-5 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
    </header>
  );
}
