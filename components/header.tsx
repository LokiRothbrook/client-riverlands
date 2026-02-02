"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { counties } from "@/lib/counties";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu02Icon,
  ArrowDown01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/history", label: "History" },
  { href: "/partners", label: "Partners" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold tracking-wide text-primary">
              RIVER
            </span>
            <span className="text-xl font-normal tracking-wide text-amber">
              LANDS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.label === "Home" ? (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Counties Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/counties")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Counties
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  className="opacity-60"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {counties.map((county) => (
                <DropdownMenuItem key={county.slug} asChild>
                  <Link
                    href={`/counties/${county.slug}`}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={14}
                      className="text-amber"
                    />
                    <div>
                      <div className="font-medium">{county.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {county.seat}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link href="/newsletter">Subscribe</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Menu02Icon} size={20} />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold tracking-wide text-primary">
                    RIVER
                  </span>
                  <span className="text-lg font-normal tracking-wide text-amber">
                    LANDS
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                    (link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href))
                      ? "bg-secondary text-primary"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Counties section in mobile */}
              <div className="mt-2 border-t pt-3">
                <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Counties
                </span>
                <div className="mt-2 flex flex-col gap-0.5">
                  {counties.map((county) => (
                    <Link
                      key={county.slug}
                      href={`/counties/${county.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary",
                        pathname === `/counties/${county.slug}`
                          ? "bg-secondary text-primary"
                          : "text-foreground"
                      )}
                    >
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={14}
                        className="text-amber"
                      />
                      {county.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 px-3">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link
                    href="/newsletter"
                    onClick={() => setMobileOpen(false)}
                  >
                    Subscribe to Newsletter
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
