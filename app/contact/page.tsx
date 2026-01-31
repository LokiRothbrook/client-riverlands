import type { Metadata } from "next";
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
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Location01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Riverlands team. General inquiries, advertising, partnerships, and feedback.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Have a question, suggestion, or want to work with us? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" placeholder="Full name" required />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="What is this about?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="advertising">
                          Advertising Inquiry
                        </SelectItem>
                        <SelectItem value="partnership">
                          Partnership Inquiry
                        </SelectItem>
                        <SelectItem value="content">
                          Content Submission
                        </SelectItem>
                        <SelectItem value="feedback">
                          Feedback / Suggestion
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact info */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      info@riverlands.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based in Pittsfield, Illinois
                      <br />
                      Serving the river counties of western IL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground">
                  For Businesses
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Interested in advertising or becoming a featured partner?
                  Select &quot;Advertising Inquiry&quot; or &quot;Partnership
                  Inquiry&quot; in the form, or visit our dedicated pages.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
