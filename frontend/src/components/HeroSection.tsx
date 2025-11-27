import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export const HeroSection = () => {
  const whatsappNumber = '+237XXXXXXXXX';
  const whatsappMessage = encodeURIComponent('Bonjour ! Je suis intéressé par vos produits tech.');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
              Revendeur Tech de Confiance au Bénin
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Technologie de Qualité
              <span className="block text-primary mt-2">À Portée de Main</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Découvrez une large gamme d'ordinateurs, composants, imprimantes et accessoires. 
              Nous photographions les produits dans nos magasins partenaires et vous apportons les meilleures offres au Bénin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="block sm:inline-block">
                <Button size="lg" className="w-full sm:w-auto group">
                  Parcourir les Produits
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <a
                href="https://wa.me/22900000000?text=Bonjour%20%21%20Je%20suis%20intéressé%20par%20vos%20produits%20tech."
                target="_blank"
                rel="noopener noreferrer"
                className="block sm:inline-block"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white border-[#25D366]">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactez-nous
                </Button>
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Produits</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Magasins Partenaires</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden card-shadow-hover">
              <img
                src={heroImage}
                alt="Technology products showcase"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
