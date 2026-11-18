import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createRequirementApi,
  deleteRequirementApi,
  fetchRequirements,
  getErrorMessage,
  resetSeedApi,
  syncBitableApi,
  updateRequirementApi,
  updateRequirementStatusApi,
} from '@/api/requirement';
import type {
  Requirement,
  RequirementInput,
  RequirementStatus,
} from './types';

const QUERY_KEY = ['requirements'] as const;

type SuccessCallback = () => void;

interface RequirementContextValue {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  submitting: boolean;
  bitableSyncing: boolean;
  addRequirement: (input: RequirementInput, onSuccess?: SuccessCallback) => void;
  updateRequirement: (
    id: string,
    input: RequirementInput,
    onSuccess?: SuccessCallback,
  ) => void;
  changeStatus: (
    id: string,
    status: RequirementStatus,
    onSuccess?: SuccessCallback,
  ) => void;
  removeRequirement: (id: string, onSuccess?: SuccessCallback) => void;
  resetDemo: (onSuccess?: SuccessCallback) => void;
  syncBitable: () => void;
}

export const useRequirements = (): RequirementContextValue => {
  const queryClient = useQueryClient();
  const query = useQuery<Requirement[]>({
    queryKey: QUERY_KEY,
    queryFn: fetchRequirements,
  });

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (input: RequirementInput) => createRequirementApi(input),
    retry: false,
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RequirementInput }) =>
      updateRequirementApi(id, input),
    retry: false,
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequirementStatus }) =>
      updateRequirementStatusApi(id, status),
    retry: false,
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRequirementApi(id),
    retry: false,
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const resetMutation = useMutation({
    mutationFn: () => resetSeedApi(),
    retry: false,
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const syncMutation = useMutation({
    mutationFn: () => syncBitableApi(),
    retry: false,
    onSuccess: (info) => {
      invalidate();
      toast.success(
        `多维表格同步完成：已同步 ${info.synced} 条，待处理 ${info.pending} 条，失败 ${info.failed} 条`,
      );
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  return {
    requirements: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error) : null,
    refetch: () => {
      void query.refetch();
    },
    submitting: createMutation.isPending || updateMutation.isPending,
    bitableSyncing: syncMutation.isPending,
    addRequirement: (input, onSuccess) =>
      createMutation.mutate(input, { onSuccess }),
    updateRequirement: (id, input, onSuccess) =>
      updateMutation.mutate({ id, input }, { onSuccess }),
    changeStatus: (id, status, onSuccess) =>
      statusMutation.mutate({ id, status }, { onSuccess }),
    removeRequirement: (id, onSuccess) =>
      deleteMutation.mutate(id, { onSuccess }),
    resetDemo: (onSuccess) =>
      resetMutation.mutate(undefined, { onSuccess }),
    syncBitable: () => syncMutation.mutate(),
  };
};
