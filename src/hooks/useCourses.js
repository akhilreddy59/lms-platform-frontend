import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { useUI } from '../context/UIContext';

export const useCourses = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const useList = (options = {}) => useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll(),
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useDetail = (id, options = {}) => useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useCreate = () => useMutation({
    mutationFn: (data) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast('Course created successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUpdate = (id) => useMutation({
    mutationFn: (data) => courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', id] });
      showToast('Course updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useDelete = () => useMutation({
    mutationFn: (id) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast('Course deleted successfully!', 'success');
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
