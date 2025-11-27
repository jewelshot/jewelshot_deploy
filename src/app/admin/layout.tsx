/**
 * Admin Layout
 * 
 * Standalone layout for admin pages (no sidebar)
 */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full">
      {children}
    </div>
  );
}

