import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Dashboard from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.name || 'utilisateur'}
            </p>
          </div>

          {user?.role === 'client' && (
            <Link to="/appointments/new">
              <Button className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                Nouveau rendez-vous
              </Button>
            </Link>
          )}
        </div>
        <Dashboard userType={user?.role || 'client'} />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
