import type { Metadata } from "next";
import { counties } from "@/lib/counties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to the Riverlands newsletter and get the latest events, stories, and travel tips from the river counties of western Illinois.",
};

export default function NewsletterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Stay Connected
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Get the latest events, stories, and travel tips from across the
            river counties delivered to your inbox.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to Our Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Counties of Interest</Label>
                <p className="text-xs text-muted-foreground">
                  Select which counties you&apos;d like to hear about
                  (optional — leave blank for all)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {counties.map((county) => (
                    <label
                      key={county.slug}
                      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="counties"
                        value={county.slug}
                        className="rounded border-input"
                      />
                      {county.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground">
                We send newsletters weekly or bi-weekly. No spam, ever. You
                can unsubscribe at any time.
              </div>

              <Button type="submit" size="lg" className="w-full">
                Subscribe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
