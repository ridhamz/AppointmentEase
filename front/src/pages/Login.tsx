import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur AppointEase!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Identifiants incorrects. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Une erreur s'est produite",
        description: "Impossible de se connecter pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground mt-2">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>
          
          <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} />
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Vous n'avez pas de compte?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Inscrivez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
