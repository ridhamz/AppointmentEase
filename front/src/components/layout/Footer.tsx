
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="font-bold text-xl flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white rounded-md px-2 py-1">📅</span>
              <span>AppointEase</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme de gestion de rendez-vous pour les professionnels et leurs clients.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Entreprise</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">À propos</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Carrières</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Politique de confidentialité</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Conditions d'utilisation</Link></li>
              <li><Link to="/gdpr" className="text-muted-foreground hover:text-foreground">RGPD</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Assistance</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Centre d'aide</Link></li>
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {currentYear} AppointEase. Tous droits réservés.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
