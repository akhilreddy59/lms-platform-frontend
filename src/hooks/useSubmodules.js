import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submoduleService } from '../services/submoduleService';
import { useUI } from '../context/UIContext';

export const useSubmodules = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const useList = (options = {}) => useQuery({
    queryKey: ['submodules'],
    queryFn: () => submoduleService.getAll(),
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useListByModule = (moduleId, options = {}) => useQuery({
    queryKey: ['submodules', 'module', moduleId],
    queryFn: () => submoduleService.getByModuleId(moduleId),
    enabled: !!moduleId,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useDetail = (id, options = {}) => useQuery({
    queryKey: ['submodules', id],
    queryFn: () => submoduleService.getById(id),
    enabled: !!id,
    onError: (err) => showToast(err.message, 'error'),
    ...options,
  });

  const useCreate = () => useMutation({
    mutationFn: (data) => submoduleService.create(data),
    onSuccess: (newSub) => {
      queryClient.invalidateQueries({ queryKey: ['submodules'] });
      queryClient.invalidateQueries({ queryKey: ['submodules', 'module', newSub.moduleId] });
      showToast('Submodule created successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useUpdate = (id) => useMutation({
    mutationFn: (data) => submoduleService.update(id, data),
    onSuccess: (updatedSub) => {
      queryClient.invalidateQueries({ queryKey: ['submodules'] });
      queryClient.invalidateQueries({ queryKey: ['submodules', id] });
      queryClient.invalidateQueries({ queryKey: ['submodules', 'module', updatedSub.moduleId] });
      showToast('Submodule updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useDelete = () => useMutation({
    mutationFn: ({ id }) => submoduleService.delete(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submodules'] });
      if (variables.moduleId) {
        queryClient.invalidateQueries({ queryKey: ['submodules', 'module', variables.moduleId] });
      }
      showToast('Submodule deleted successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  const useReorder = () => useMutation({
    mutationFn: ({ orderedIds }) => submoduleService.updatePositions(orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submodules'] });
      if (variables.moduleId) {
        queryClient.invalidateQueries({ queryKey: ['submodules', 'module', variables.moduleId] });
      }
      showToast('Submodule layout saved!', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    },
  });

  return {
    useList,
    useListByModule,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    useReorder,
  };
};
