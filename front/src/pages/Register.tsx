import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const success = await register(
        data.name, 
        data.email, 
        data.password, 
        data.role
      );
      
      if (success) {
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue sur AppointEase!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Échec de l'inscription",
          description: "Cette adresse e-mail est peut-être déjà utilisée.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Une erreur s'est produite",
        description: "Impossible de créer votre compte pour le moment.",
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
            <h1 className="text-2xl font-bold">Inscription</h1>
            <p className="text-muted-foreground mt-2">
              Créez votre compte pour commencer à utiliser AppointEase
            </p>
          </div>
          
          <AuthForm type="register" onSubmit={handleSubmit} isLoading={isLoading} />
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
