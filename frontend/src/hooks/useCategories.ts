import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  icon_file: string | null;
  parent: number | null;
  parent_name?: string;
  children?: Category[];
  product_count: number;
  direct_product_count?: number;
  is_main_category: boolean;
  level?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export const useCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories/'),
    retry: 2,
    staleTime: 1000 * 60 * 30,
  });
};

export const useMainCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories', 'main'],
    queryFn: async () => {
      const data = await api.get('/categories/?level=0');
      return data.results || [];
    },
    retry: 2,
    staleTime: 1000 * 60 * 60,
  });
};

export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const data = await api.get('/categories/');
      return data.results || [];
    },
    retry: 2,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCategory = (slug: string) => {
  return useQuery<Category>({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}/`),
    enabled: !!slug,
    retry: 2,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCategoryProducts = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug, 'products'],
    queryFn: () => api.get(`/categories/${slug}/products/`),
    enabled: !!slug,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
};
