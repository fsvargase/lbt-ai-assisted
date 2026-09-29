import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-background py-12 text-muted">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Logo & Info column */}
          <div className="space-y-4">
            <Link
              href="/"
              data-testid="footer-link-home"
              className="text-base font-semibold tracking-wide text-foreground hover:text-accent-gold transition"
            >
              Luxury Budget Transportation
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Premium chauffeured ground transportation in New York City.
              Experience unparalleled luxury at a reasonable cost.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/#services"
                  data-testid="footer-link-services"
                  className="hover:text-foreground transition"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#fleet"
                  data-testid="footer-link-fleet"
                  className="hover:text-foreground transition"
                >
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  data-testid="footer-link-contact"
                  className="hover:text-foreground transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Bookings / Flows */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Bookings
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/new"
                  data-testid="footer-link-book"
                  className="hover:text-accent-gold text-accent-gold transition font-medium"
                >
                  Book New Ride
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  data-testid="footer-link-bookings"
                  className="hover:text-foreground transition"
                >
                  Manage Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  data-testid="footer-link-signin"
                  className="hover:text-foreground transition"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            &copy; {currentYear} Luxury Budget Transportation. All rights reserved. Registered in NYC, USA.
          </p>
          <p className="text-gray-600">
            Premium chauffeur service at reasonable cost.
          </p>
        </div>
      </div>
    </footer>
  );
}
