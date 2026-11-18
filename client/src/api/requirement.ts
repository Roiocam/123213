import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  BitableSyncInfo,
  CreateRequirementRequest,
  RequirementRecord,
  UpdateRequirementRequest,
} from '@shared/api.interface';

const BASE_URL = '/api/requirements';

export const getErrorMessage = (error: unknown): string => {
  const candidate = error as {
    response?: { data?: { error?: { message?: string } } };
    message?: string;
  };
  return (
    candidate?.response?.data?.error?.message ??
    candidate?.message ??
    '操作失败，请稍后重试'
  );
};

export async function fetchRequirements(): Promise<RequirementRecord[]> {
  const response = await axiosForBackend.get(BASE_URL);
  if (response.status === 403) {
    throw new Error('没有权限访问需求数据');
  }
  const body = response.data as { items: RequirementRecord[] };
  return body.items;
}

export async function createRequirementApi(
  body: CreateRequirementRequest,
): Promise<RequirementRecord> {
  const response = await axiosForBackend.post(BASE_URL, body);
  return response.data as RequirementRecord;
}

export async function updateRequirementApi(
  id: string,
  body: UpdateRequirementRequest,
): Promise<RequirementRecord> {
  const response = await axiosForBackend.patch(`${BASE_URL}/${id}`, body);
  return response.data as RequirementRecord;
}

export async function updateRequirementStatusApi(
  id: string,
  status: RequirementRecord['status'],
): Promise<RequirementRecord> {
  const response = await axiosForBackend.patch(`${BASE_URL}/${id}/status`, {
    status,
  });
  return response.data as RequirementRecord;
}

export async function deleteRequirementApi(
  id: string,
): Promise<{ id: string }> {
  const response = await axiosForBackend.delete(`${BASE_URL}/${id}`);
  return response.data as { id: string };
}

export async function resetSeedApi(): Promise<{ inserted: number }> {
  const response = await axiosForBackend.post(`${BASE_URL}/seed/reset`);
  return response.data as { inserted: number };
}

export async function syncBitableApi(): Promise<BitableSyncInfo> {
  const response = await axiosForBackend.post(`${BASE_URL}/bitable/sync`);
  return response.data as BitableSyncInfo;
}

export async function getBitableSyncInfoApi(): Promise<BitableSyncInfo> {
  const response = await axiosForBackend.get(`${BASE_URL}/bitable/sync-info`);
  return response.data as BitableSyncInfo;
}

export async function pingBitableApi(): Promise<{
  ok: boolean;
  message: string;
}> {
  const response = await axiosForBackend.get(`${BASE_URL}/bitable/ping`);
  return response.data as { ok: boolean; message: string };
}
