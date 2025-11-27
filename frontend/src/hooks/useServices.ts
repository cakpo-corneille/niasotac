import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  is_active: boolean;
  external_link?: string;
}

export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export const useServices = (onlyActive = true) => {
  return useQuery<ServicesResponse>({
    queryKey: ['services', { active: onlyActive }],
    queryFn: async () => {
      const params = onlyActive ? '?is_active=true&ordering=order' : '?ordering=order';
      return await api.get(`/services/${params}`);
    },
    retry: 2,
    staleTime: 1000 * 60 * 60,
  });
};
