
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CalendarIcon, Clock, BellIcon, UsersIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plateforme de Gestion des Rendez-vous
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Développez votre activité avec notre solution complète de gestion de rendez-vous 
              pour les professionnels et leurs clients.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4" id="features">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Fonctionnalités principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Gestion des rôles
                </h3>
                <p className="text-muted-foreground">
                  Différents niveaux d'accès pour les administrateurs, professionnels et clients.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <CalendarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Calendrier intégré
                </h3>
                <p className="text-muted-foreground">
                  Visualisez et gérez facilement vos disponibilités et rendez-vous.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Création et suivi
                </h3>
                <p className="text-muted-foreground">
                  Création, modification et annulation de rendez-vous en quelques clics.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <BellIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Notifications
                </h3>
                <p className="text-muted-foreground">
                  Notifications par e-mail pour les confirmations, rappels et modifications.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à optimiser votre gestion de rendez-vous?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Inscrivez-vous dès maintenant et découvrez comment notre plateforme peut simplifier votre quotidien.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  S'inscrire gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
