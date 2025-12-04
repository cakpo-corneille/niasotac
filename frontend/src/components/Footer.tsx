import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { newsletterService } from '@/lib/newsletter';

const social_icons: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const Footer = () => {
  const { data: settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setNewsletterStatus('loading');
    try {
      const result = await newsletterService.subscribe({
        email,
        source: 'footer',
      });

      if (result.success) {
        setNewsletterStatus('success');
        setEmail('');
        setConsent(false);
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      }
    } catch {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };
  
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Newsletter Section */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Restez informé</h3>
            <p className="text-sm text-muted-foreground mb-4">Nos meilleures offres directement dans votre boîte mail</p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={newsletterStatus === 'loading'}
                required
                data-testid="input-newsletter-email"
              />
              
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  disabled={newsletterStatus === 'loading'}
                  data-testid="checkbox-newsletter-consent"
                />
                <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer">
                  J'accepte de recevoir des emails marketing et d'actualités
                </label>
              </div>

              {newsletterStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Vérifiez votre email !</span>
                </div>
              )}

              {newsletterStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Erreur. Veuillez réessayer.</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!email || !consent || newsletterStatus === 'loading'}
                size="sm"
                data-testid="button-newsletter-submit"
              >
                {newsletterStatus === 'loading' ? 'Inscription...' : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="h-10 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                  NT
                </div>
              </Link>

              <span className="text-lg font-bold">
                NIASOTAC <span className="text-primary">TECHNOLOGIE</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {settings?.company_description || 'Votre revendeur tech de confiance au Bénin. Produits de qualité à prix compétitifs.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=computers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Ordinateurs
                </Link>
              </li>
              <li>
                <Link to="/products?category=components" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Composants
                </Link>
              </li>
              <li>
                <Link to="/products?category=printers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Imprimantes
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings?.contact_address || 'Cotonou, Bénin'}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${settings?.contact_phone || '+22900000000'}`} className="hover:text-primary transition-colors">
                  {settings?.contact_phone || '+229 00 00 00 00'}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${settings?.contact_email || 'contact@niasotac.com'}`} className="hover:text-primary transition-colors">
                  {settings?.contact_email || 'contact@niasotac.com'}
                </a>
              </li>
              <li>
                <h3 className='font-semibold mb-2'>Suivez-nous</h3>
                <ul className='flex gap-3'>
                  {settings?.social_links && Array.isArray(settings.social_links) && settings.social_links.map((link: any) => {
                    if (!link.url) return null;
                    const Icon = social_icons[link.name.toLowerCase()];
                    return ( 
                      <li key={link.name}>
                        <a href={link.url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary transition-colors' data-testid={`link-social-${link.name}`}>
                          {Icon && <Icon className='h-5 w-5'/>}
                        </a>
                      </li>
                     );
                  })}
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NIASOTAC TECHNOLOGIE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
