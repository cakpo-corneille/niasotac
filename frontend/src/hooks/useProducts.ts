import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: string;
  compare_at_price?: string;
  final_price?: string;
  display_price: string;
  brand: string;
  image: string;
  main_image?: string;
  category: number;
  category_name: string;
  in_stock: boolean;
  is_in_stock?: boolean;
  featured: boolean;
  is_featured?: boolean;
  is_recommended?: boolean;
  has_discount?: boolean;
  whatsapp_link: string;
  gallery: [];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const useProducts = (params?: {
  category?: string;
  category_slug?: string;
  brand?: string;
  in_stock?: boolean;
  is_in_stock?: boolean;
  is_featured?: boolean;
  is_recommended?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
  has_discount?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category_slug) queryParams.append('category_slug', params.category_slug);
  if (params?.category) queryParams.append('category_slug', params.category);
  if (params?.brand) queryParams.append('brand', params.brand);
  if (params?.is_in_stock !== undefined) queryParams.append('is_in_stock', String(params.is_in_stock));
  if (params?.in_stock !== undefined) queryParams.append('is_in_stock', String(params.in_stock));
  if (params?.is_featured !== undefined) queryParams.append('is_featured', String(params.is_featured));
  if (params?.is_recommended !== undefined) queryParams.append('is_recommended', String(params.is_recommended));
  if (params?.min_price !== undefined) queryParams.append('min_price', String(params.min_price));
  if (params?.max_price !== undefined) queryParams.append('max_price', String(params.max_price));
  if (params?.has_discount !== undefined) queryParams.append('has_discount', String(params.has_discount));
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.page_size) queryParams.append('page_size', String(params.page_size));

  const queryString = queryParams.toString();
  const endpoint = `/products/${queryString ? `?${queryString}` : ''}`;

  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: () => api.get(endpoint),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (slug: string) => {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}/`),
    enabled: !!slug,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/?is_featured=true&ordering=-featured_score&page_size=20'),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecentProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', 'recent'],
    queryFn: () => api.get('/products/?ordering=-created_at&page_size=8'),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductStats = () => {
  return useQuery({
    queryKey: ['products', 'stats'],
    queryFn: async () => {
      const response = await api.get('/products/');
      return {
        total: response.count || 0,
        in_stock: response.count || 0,
        featured: response.count || 0,
      };
    },
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
};
