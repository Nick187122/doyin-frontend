import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useProductsQuery() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });
}

export function usePublicProductsQuery() {
  return useQuery({
    queryKey: ['public', 'products'],
    queryFn: async () => {
      const res = await api.get('/public/products');
      return res.data || [];
    },
  });
}

export function usePublicCategoriesQuery() {
  return useQuery({
    queryKey: ['public', 'categories'],
    queryFn: async () => {
      const res = await api.get('/public/categories');
      return res.data || [];
    },
  });
}

export function usePublicSettingsQuery() {
  return useQuery({
    queryKey: ['public', 'settings'],
    queryFn: async () => {
      const res = await api.get('/public/settings');
      return res.data;
    },
  });
}

export function usePublicHeroImagesQuery() {
  return useQuery({
    queryKey: ['public', 'hero-images'],
    queryFn: async () => {
      const res = await api.get('/public/hero-images');
      return res.data || [];
    },
  });
}

export function useInteractionsQuery() {
  return useQuery({
    queryKey: ['admin', 'interactions'],
    queryFn: async () => {
      const res = await api.get('/interactions');
      return res.data;
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
}

export function useSaveCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => {
      if (id) return api.put(`/categories/${id}`, data);
      return api.post('/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
    },
  });
}

export function useToggleProductStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, in_stock }) => {
      const fd = new FormData();
      fd.append('in_stock', in_stock ? 1 : 0);
      fd.append('_method', 'PUT');
      return api.post(`/products/${id}`, fd);
    },
    onMutate: async ({ id, in_stock }) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'products'] });
      const previous = queryClient.getQueryData(['admin', 'products']);
      queryClient.setQueryData(['admin', 'products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, in_stock } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['admin', 'products'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUpdateProductPriceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price }) => {
      const fd = new FormData();
      fd.append('price', price);
      fd.append('_method', 'PUT');
      return api.post(`/products/${id}`, fd);
    },
    onMutate: async ({ id, price }) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'products'] });
      const previous = queryClient.getQueryData(['admin', 'products']);
      queryClient.setQueryData(['admin', 'products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, price } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['admin', 'products'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useToggleInteractionReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/interactions/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interactions'] });
    },
  });
}

export function useDeleteInteractionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/interactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interactions'] });
    },
  });
}

export function useClearInteractionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/interactions/clear'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interactions'] });
    },
  });
}
