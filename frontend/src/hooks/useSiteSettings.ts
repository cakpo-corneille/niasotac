import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface SiteSettings {
  whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  company_name: string;
  company_description: string;
  social_links:[];
  updated_at: string;
}

export const useSiteSettings = () => {
  return useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await api.get('/settings/');
      return response.results?.[0] || response;
    },
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
