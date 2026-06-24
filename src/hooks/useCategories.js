import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { useUI } from '../context/UIContext';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const useList = (options = {}) => useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useDetail = (id, options = {}) => useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useCreate = () => useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Category created successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUpdate = (id) => useMutation({
    mutationFn: (data) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
      showToast('Category updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useDelete = () => useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // Invalidate courses too since relationships exist
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast('Category deleted successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
  };
};
