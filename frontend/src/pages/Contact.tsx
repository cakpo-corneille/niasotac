/**
 * Page Contact - NIASOTAC TECHNOLOGIE
 * Formulaire de contact et informations de contact
 */
import { ContactForm } from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
  const { data: settings, isLoading } = useSiteSettings();

  const whatsappNumber = settings?.whatsapp_number || '22900000000';
  const whatsappMessage = encodeURIComponent('Bonjour ! J\'aimerais entrer en contact avec vous.');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contactez-nous</h1>
            <p className="text-xl text-muted-foreground">
              Vous avez des questions ? Nous sommes là pour vous aider ! Contactez-nous via WhatsApp ou envoyez-nous un message.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Informations de Contact */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Informations de Contact</h2>
              <p className="text-muted-foreground">
                N'hésitez pas à nous contacter via l'un des canaux suivants. Nous répondons généralement en quelques heures.
              </p>
            </div>

            {/* Cartes de Contact */}
            <div className="space-y-4">
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Meilleur moyen de nous joindre pour des réponses rapides
                      </p>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="bg-[#25D366] hover:bg-[#20BD5A] text-white border-[#25D366]">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Discuter sur WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Appelez-nous pendant les heures ouvrables
                      </p>
                      <a
                        href={`tel:${settings?.contact_phone || '+22900000000'}`}
                        className="text-primary hover:underline"
                      >
                        {settings?.contact_phone || '+229 00 00 00 00'}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Envoyez-nous un message détaillé
                      </p>
                      <a
                        href={`mailto:${settings?.contact_email || 'contact@niasotac.com'}`}
                        className="text-primary hover:underline"
                      >
                        {settings?.contact_email || 'contact@niasotac.com'}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Localisation</h3>
                      <p className="text-muted-foreground text-sm">
                        {settings?.contact_address || 'Cotonou, Bénin'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Réseaux sociaux */}
              {settings?.social_links && typeof settings.social_links === 'object' && Object.keys(settings.social_links).length > 0 && (
                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Suivez-nous</h3>
                    <div className="flex gap-3 flex-wrap">
                      {(settings.social_links as any).facebook && (
                        <a
                          href={(settings.social_links as any).facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                        >
                          <Facebook className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {(settings.social_links as any).twitter && (
                        <a
                          href={(settings.social_links as any).twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                        >
                          <Twitter className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {(settings.social_links as any).instagram && (
                        <a
                          href={(settings.social_links as any).instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                        >
                          <Instagram className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {(settings.social_links as any).linkedin && (
                        <a
                          href={(settings.social_links as any).linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-primary" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Heures d'Ouverture */}
            <Card className="bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Heures d'Ouverture</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Lundi - Vendredi : 8h00 - 18h00</p>
                      <p>Samedi : 9h00 - 16h00</p>
                      <p>Dimanche : Fermé</p>
                      <p className="pt-2 text-accent font-medium">Support WhatsApp : 24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de Contact */}
          <div>
            <Card className="card-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Envoyez-nous un Message</h2>
                  <p className="text-muted-foreground">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
