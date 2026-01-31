import type { Metadata } from "next";
import { counties } from "@/lib/counties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "Apply to have your business featured in the Riverlands directory. Reach visitors exploring the seven river counties of western Illinois.",
};

export default function PartnerApplyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Become a Partner
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Get your business featured on Riverlands and reach visitors
            exploring the seven river counties of western Illinois.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    placeholder="Your business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Person *</Label>
                  <Input
                    id="contact-name"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select>
                    <SelectTrigger id="county">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((county) => (
                        <SelectItem key={county.slug} value={county.slug}>
                          {county.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Business Category *</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lodging">
                        Lodging &amp; Hotels
                      </SelectItem>
                      <SelectItem value="dining">
                        Restaurants &amp; Dining
                      </SelectItem>
                      <SelectItem value="shopping">
                        Shopping &amp; Retail
                      </SelectItem>
                      <SelectItem value="recreation">
                        Recreation &amp; Outdoors
                      </SelectItem>
                      <SelectItem value="museum">
                        Museums &amp; Attractions
                      </SelectItem>
                      <SelectItem value="services">
                        Services &amp; Professional
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  placeholder="Street address, city, state, zip"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Business Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your business — what you offer, your history, what makes you special..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Information</Label>
                <Textarea
                  id="additional"
                  placeholder="Hours of operation, seasonal availability, anything else visitors should know..."
                  rows={3}
                />
              </div>

              <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
                <p>
                  Submissions are reviewed by our team. You&apos;ll receive a
                  confirmation email once your listing has been approved. Free
                  basic listings are available, with featured placement
                  options for enhanced visibility.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
