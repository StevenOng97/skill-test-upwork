import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}