import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Check, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsletterService } from '@/lib/newsletter';

interface NewsletterFormProps {
  variant?: 'default' | 'compact';
  showTitle?: boolean;
  source?: string;
}

export const NewsletterForm = ({ variant = 'default', showTitle = true, source = 'page' }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Vérifier à la montée du composant et faire un polling continu
  useEffect(() => {
    let mounted = true;

    const checkSubscriptionStatus = async () => {
      if (!mounted) return;
      
      const savedEmail = newsletterService.getSavedEmail();
      if (savedEmail) {
        const status = await newsletterService.checkStatus(savedEmail);
        if (!mounted) return;
        
        if (status.confirmed && status.subscribed) {
          setIsConfirmed(true);
          setEmail(savedEmail);
          setSuccess(false);
          setIsLoading(false);
        } else if (status.exists && !status.confirmed) {
          setSuccess(true);
          setEmail(savedEmail);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    // Check initial
    checkSubscriptionStatus();

    // Polling continu chaque 2 secondes
    const continuousInterval = setInterval(() => {
      checkSubscriptionStatus();
    }, 2000);

    // Listener pour retrigger le check quand l'onglet regagne le focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSubscriptionStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      clearInterval(continuousInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !consent) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs et accepter les conditions',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await newsletterService.subscribe({
        email,
        source,
      });

      if (result.success) {
        setSuccess(true);
        setConsent(false);

        toast({
          title: 'Succès!',
          description: result.message,
        });

        // Garder success à true jusqu'à la confirmation de l'email
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si déjà confirmé, disparaître complètement
  if (isConfirmed && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="w-full" data-testid="form-newsletter-compact">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || success}
            className="flex-1"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            disabled={isSubmitting || success}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
            data-testid="button-newsletter-submit"
          >
            {success ? <Check className="h-4 w-4" /> : 'S\'abonner'}
          </Button>
        </div>
        {success && (
          <p className="text-xs text-green-600 mt-2">Inscription confirmée!</p>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-6" data-testid="form-newsletter-default">
      {showTitle && (
        <>
          <h3 className="text-2xl font-bold">Restez informé</h3>
          <p className="text-muted-foreground">
            Inscrivez-vous à notre newsletter pour recevoir les dernières offres et nouvelles
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newsletter-email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || success}
              className="pl-10"
              data-testid="input-newsletter-email"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="newsletter-consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            disabled={isSubmitting || success}
            data-testid="checkbox-newsletter-consent"
          />
          <label
            htmlFor="newsletter-consent"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            J'accepte de recevoir des communications marketing de NIASOTAC TECHNOLOGIE
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
          data-testid="button-newsletter-submit"
        >
          {success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Inscription confirmée!
            </>
          ) : isSubmitting ? (
            'Traitement...'
          ) : (
            "S'abonner à la newsletter"
          )}
        </Button>

        {success && (
          <p className="text-sm text-green-600 text-center">
            Merci! Vérifiez votre email pour confirmer votre inscription.
          </p>
        )}
      </form>
    </div>
  );
};
