import Link from "next/link";
import { SERVICES } from "@/lib/seo/services";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-gray-200">
        <nav
          aria-label="Services"
          className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4 px-6 py-4 text-sm"
        >
          <Link href="/" className="font-semibold">
            Luxury Budget Transport
          </Link>
          <span className="mx-2 text-gray-300">|</span>
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="text-gray-600 hover:text-black"
            >
              {s.title}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-gray-500">
          Premium chauffeured ground transportation in New York City ·{" "}
          <Link href="/new" className="underline">
            Book now
          </Link>
        </div>
      </footer>
    </div>
  );
}
