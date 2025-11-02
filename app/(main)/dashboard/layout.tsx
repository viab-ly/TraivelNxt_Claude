/**
 * Dashboard Layout
 *
 * Provides the base layout structure for the dashboard pages.
 * Sets up full viewport height and basic flex structure for the dashboard shell.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  );
}
