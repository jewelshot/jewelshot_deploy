/**
 * Sentry Debug Layout
 * Full-screen layout without sidebar for debug pages
 */

export default function SentryDebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-y-auto bg-gray-50">
      {children}
    </div>
  );
}

