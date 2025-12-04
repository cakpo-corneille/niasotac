import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export const ConfirmNewsletter = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token invalide');
        return;
      }

      try {
        const response = await api.post('/newsletter/subscribers/confirm/', { token });
        setStatus('success');
        setMessage(response.message || 'Email confirmé avec succès!');
        // Effacer le localStorage et rediriger après 3 secondes
        localStorage.removeItem('newsletter_email');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.details?.error || error.message || 'Erreur lors de la confirmation');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Confirmation en cours...</h1>
            <p className="text-muted-foreground">Veuillez patienter pendant que nous confirmons votre email</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900">Succès!</h1>
            <p className="text-green-700">{message}</p>
            <p className="text-sm text-muted-foreground">Redirection vers l'accueil...</p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Retour à l'accueil
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900">Erreur</h1>
            <p className="text-red-700">{message}</p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
