import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mb-2">
          <span className="text-2xl font-bold tracking-wide text-river-blue">
            RIVER
          </span>
          <span className="text-2xl font-normal tracking-wide text-amber">
            LANDS
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to the admin panel
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center">
          <Link
            href="/admin/reset-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
