import Link from "next/link";
import { counties } from "@/lib/counties";

const quickLinks = [
  { href: "/events", label: "Events" },
  { href: "/history", label: "History & Heritage" },
  { href: "/partners", label: "Business Directory" },
  { href: "/explore", label: "Explore the Map" },
  { href: "/advertise", label: "Advertise With Us" },
  { href: "/about", label: "About Riverlands" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="border-t bg-river-blue text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-baseline gap-0.5">
              <span className="text-xl font-bold tracking-wide text-white">
                RIVER
              </span>
              <span className="text-xl font-normal tracking-wide text-amber-light">
                LANDS
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Discover the historic river counties of western Illinois. From
              Lincoln&apos;s footsteps to bald eagle watching, your adventure
              starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-light">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Counties */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-light">
              Counties
            </h3>
            <ul className="mt-3 space-y-2">
              {counties.map((county) => (
                <li key={county.slug}>
                  <Link
                    href={`/counties/${county.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {county.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-light">
              Stay Connected
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Get the latest events, stories, and travel tips delivered to your
              inbox.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
              <button
                type="submit"
                className="rounded-md bg-amber px-4 py-2 text-sm font-medium text-river-blue-dark transition-colors hover:bg-amber-light"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Riverlands. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-white/50 transition-colors hover:text-white/70"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/50 transition-colors hover:text-white/70"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
