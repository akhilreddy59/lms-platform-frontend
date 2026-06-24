import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleService } from '../services/moduleService';
import { useUI } from '../context/UIContext';

export const useModules = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const useList = (options = {}) => useQuery({
    queryKey: ['modules'],
    queryFn: () => moduleService.getAll(),
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useListByCourse = (courseId, options = {}) => useQuery({
    queryKey: ['modules', 'course', courseId],
    queryFn: () => moduleService.getByCourseId(courseId),
    enabled: !!courseId,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useDetail = (id, options = {}) => useQuery({
    queryKey: ['modules', id],
    queryFn: () => moduleService.getById(id),
    enabled: !!id,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useCreate = () => useMutation({
    mutationFn: (data) => moduleService.create(data),
    onSuccess: (newMod) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['modules', 'course', newMod.courseId] });
      showToast('Module created successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUpdate = (id) => useMutation({
    mutationFn: (data) => moduleService.update(id, data),
    onSuccess: (updatedMod) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['modules', id] });
      queryClient.invalidateQueries({ queryKey: ['modules', 'course', updatedMod.courseId] });
      showToast('Module updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useDelete = () => useMutation({
    // We pass { id, courseId } so we can invalidate the course sublist
    mutationFn: ({ id }) => moduleService.delete(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['modules', 'course', variables.courseId] });
      }
      showToast('Module deleted successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useReorder = () => useMutation({
    mutationFn: ({ orderedIds }) => moduleService.updatePositions(orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['modules', 'course', variables.courseId] });
      }
      showToast('Module layout saved!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  return {
    useList,
    useListByCourse,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    useReorder,
  };
};
