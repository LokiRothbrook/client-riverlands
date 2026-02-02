import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApplyForm } from "@/components/forms/partner-apply-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "Apply to have your business featured in the Riverlands directory. Reach visitors exploring the seven river counties of western Illinois.",
};

export default function PartnerApplyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Partners", url: `${SITE_URL}/partners` },
          { name: "Apply", url: `${SITE_URL}/partners/apply` },
        ])}
      />

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

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Partners", href: "/partners" },
              { label: "Apply" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PartnerApplyForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
