import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { useUI } from '../context/UIContext';

export const useContents = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const useList = (options = {}) => useQuery({
    queryKey: ['contents'],
    queryFn: () => contentService.getAll(),
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useListBySubmodule = (submoduleId, options = {}) => useQuery({
    queryKey: ['contents', 'submodule', submoduleId],
    queryFn: () => contentService.getBySubmoduleId(submoduleId),
    enabled: !!submoduleId,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useDetail = (id, options = {}) => useQuery({
    queryKey: ['contents', id],
    queryFn: () => contentService.getById(id),
    enabled: !!id,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useCreate = () => useMutation({
    mutationFn: (data) => contentService.create(data),
    onSuccess: (newCont) => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['contents', 'submodule', newCont.submoduleId] });
      showToast('Content created successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUpdate = (id) => useMutation({
    mutationFn: (data) => contentService.update(id, data),
    onSuccess: (updatedCont) => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['contents', id] });
      queryClient.invalidateQueries({ queryKey: ['contents', 'submodule', updatedCont.submoduleId] });
      showToast('Content updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useDelete = () => useMutation({
    mutationFn: ({ id }) => contentService.delete(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      if (variables.submoduleId) {
        queryClient.invalidateQueries({ queryKey: ['contents', 'submodule', variables.submoduleId] });
      }
      showToast('Content deleted successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useReorder = () => useMutation({
    mutationFn: ({ orderedIds }) => contentService.updatePositions(orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      if (variables.submoduleId) {
        queryClient.invalidateQueries({ queryKey: ['contents', 'submodule', variables.submoduleId] });
      }
      showToast('Content order saved!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUploadFileMutation = () => useMutation({
    mutationFn: ({ file, onProgress }) => contentService.mockUploadFile(file, onProgress),
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  return {
    useList,
    useListBySubmodule,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    useReorder,
    useUploadFileMutation,
  };
};
