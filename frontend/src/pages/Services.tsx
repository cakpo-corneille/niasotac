/**
 * Page Services - NIASOTAC TECHNOLOGIE
 * Décrit les services offerts par NIASOTAC - Dynamique depuis l'API
 */
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, MessageCircle, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useServices } from '@/hooks/useServices';

const Services = () => {
  const { data: settings } = useSiteSettings();
  const { data: servicesData, isLoading: servicesLoading } = useServices(true);
  const services = servicesData?.results || [];

  const whatsappNumber = settings?.whatsapp_number || '+237XXXXXXXXX';
  const whatsappMessage = encodeURIComponent('Bonjour ! J\'aimerais en savoir plus sur vos services.');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero - Titre et description */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Nos Services</h1>
            <p className="text-xl text-muted-foreground">
              Nous comblons le fossé entre les magasins tech et les clients, rendant les produits 
              de qualité accessibles et abordables à travers le Bénin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/products">
                <Button size="lg">
                  Parcourir les Produits
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="bg-[#25D366] hover:bg-[#20BD5A] text-white border-[#25D366]">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactez-nous
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services détaillés - Dynamique depuis l'API */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          {servicesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <Card key={service.id} className="hover:card-shadow-hover transition-shadow hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    {/* Image du Service */}
                    {service.image && (
                      <div className="h-32 w-full rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>

                    {/* Lien externe si disponible */}
                    {service.external_link && (
                      <div>
                        <a 
                          href={service.external_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          data-testid={`link-service-${service.id}`}
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            En savoir plus
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucun service disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Pourquoi Choisir NIASOTAC */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Choisir NIASOTAC ?</h2>
              <p className="text-muted-foreground">
                Nous sommes bien plus qu'un simple revendeur - nous sommes votre partenaire tech de confiance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Réseau Étendu',
                  desc: 'Nous collaborons avec plus de 50 magasins d\'électronique à travers le Bénin, vous offrant la plus large sélection de produits.',
                },
                {
                  title: 'Prix Compétitifs',
                  desc: 'Nos relations solides avec les magasins nous permettent de négocier de meilleurs prix pour vous.',
                },
                {
                  title: 'Garantie de Qualité',
                  desc: 'Chaque produit est vérifié avant d\'être répertorié, vous assurant des articles authentiques et de qualité.',
                },
                {
                  title: 'Toujours Disponible',
                  desc: 'Support 24/7 via WhatsApp, nous sommes là quand vous avez besoin d\'assistance.',
                },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-lg border bg-card space-y-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Prêt à Commencer ?</h2>
            <p className="text-lg opacity-90">
              Parcourez nos produits ou contactez-nous directement pour trouver exactement ce dont vous avez besoin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Voir les Produits
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Écrivez-nous
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
