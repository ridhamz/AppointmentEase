
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    console.log("Navbar render - Auth status:", isAuthenticated ? "Authenticated" : "Not authenticated");
    console.log("Current user:", user);
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-2xl flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-md px-2 py-1">📅</span>
          <span>AppointEase</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="font-medium transition-colors hover:text-blue-600">
            Accueil
          </Link>
          <Link to="/features" className="font-medium transition-colors hover:text-blue-600">
            Fonctionnalités
          </Link>
          <Link to="/pricing" className="font-medium transition-colors hover:text-blue-600">
            Tarifs
          </Link>
          <Link to="/contact" className="font-medium transition-colors hover:text-blue-600">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">Tableau de bord</Button>
              </Link>
              <Button onClick={handleLogout}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Inscription</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
