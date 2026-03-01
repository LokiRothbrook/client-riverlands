export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-river-blue via-river-blue-dark to-river-blue px-4">
      {children}
    </div>
  );
}
