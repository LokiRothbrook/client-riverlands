import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { ManagePreferencesForm } from "@/components/forms/manage-preferences-form";
import { SendManageLinkForm } from "@/components/forms/send-manage-link-form";

export const metadata: Metadata = {
  title: "Manage Newsletter Preferences",
  description:
    "Update your newsletter preferences, change delivery frequency, or unsubscribe from the Riverlands newsletter.",
};

interface ManagePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ManageNewsletterPage({
  searchParams,
}: ManagePageProps) {
  const { token } = await searchParams;

  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Manage Newsletter
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Update your preferences, change how often you hear from us, or
            unsubscribe.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-xl px-4 py-3 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Newsletter", href: "/newsletter" },
              { label: "Manage" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        {token ? (
          <Suspense
            fallback={
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Loading your preferences...
                </CardContent>
              </Card>
            }
          >
            <ManagePreferencesForm token={token} />
          </Suspense>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Manage Your Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To manage your newsletter preferences, you&apos;ll need to use
                  the unique link sent to your email. You can find this link:
                </p>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  <li>
                    At the bottom of any newsletter email you&apos;ve received
                  </li>
                  <li>By requesting a new management link below</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Management Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to
                  manage your preferences or unsubscribe.
                </p>
                <SendManageLinkForm />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
