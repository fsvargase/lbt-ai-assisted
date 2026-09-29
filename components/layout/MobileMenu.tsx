"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function MobileMenu({ isOpen, setIsOpen, user }: MobileMenuProps) {
  if (!isOpen) return null;

  const isOperator = user?.role === "OPERATOR" || user?.role === "ADMIN";
  const isDriver = user?.role === "DRIVER";

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      id="mobile-menu-panel"
      data-testid="nav-menu-panel"
      className="absolute top-16 left-0 right-0 border-b border-gray-800 bg-background/98 px-6 py-6 md:hidden transition-all duration-300 ease-in-out shadow-2xl"
    >
      <nav aria-label="Mobile Navigation" className="flex flex-col gap-4">
        <Link
          href="/#services"
          data-testid="nav-link-mobile-services"
          onClick={closeMenu}
          className="block py-3 text-base font-semibold text-muted hover:text-foreground border-b border-gray-900"
        >
          Services
        </Link>
        <Link
          href="/#fleet"
          data-testid="nav-link-mobile-fleet"
          onClick={closeMenu}
          className="block py-3 text-base font-semibold text-muted hover:text-foreground border-b border-gray-900"
        >
          Our Fleet
        </Link>
        <Link
          href="/#contact"
          data-testid="nav-link-mobile-contact"
          onClick={closeMenu}
          className="block py-3 text-base font-semibold text-muted hover:text-foreground border-b border-gray-900"
        >
          Contact
        </Link>

        {isOperator && (
          <Link
            href="/dashboard/bookings"
            data-testid="nav-link-mobile-operator"
            onClick={closeMenu}
            className="block py-3 text-base font-semibold text-accent-gold hover:text-accent-gold/90 border-b border-gray-900"
          >
            Dashboard
          </Link>
        )}

        {isDriver && (
          <Link
            href="/driver/trips"
            data-testid="nav-link-mobile-driver"
            onClick={closeMenu}
            className="block py-3 text-base font-semibold text-accent-gold hover:text-accent-gold/90 border-b border-gray-900"
          >
            Driver Portal
          </Link>
        )}

        {user ? (
          <Link
            href="/bookings"
            data-testid="nav-link-mobile-bookings"
            onClick={closeMenu}
            className="block py-3 text-base font-semibold text-muted hover:text-foreground border-b border-gray-900"
          >
            My Bookings
          </Link>
        ) : (
          <Link
            href="/signin"
            data-testid="nav-link-mobile-signin"
            onClick={closeMenu}
            className="block py-3 text-base font-semibold text-muted hover:text-foreground border-b border-gray-900"
          >
            Sign In
          </Link>
        )}

        <Link
          href="/new"
          data-testid="nav-link-mobile-book"
          onClick={closeMenu}
          className="mt-2 block w-full rounded-lg bg-accent-gold py-3 text-center text-sm font-semibold uppercase tracking-wider text-background hover:bg-accent-gold/90 transition-all active:scale-95"
        >
          Book Now
        </Link>
      </nav>
    </div>
  );
}
