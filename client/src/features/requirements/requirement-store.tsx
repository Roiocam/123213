import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';

import { buildSeedRequirements } from './constants';
import type {
  Requirement,
  RequirementInput,
  RequirementStatus,
} from './types';

const STORAGE_KEY = 'requirement-board:v1';

interface RequirementContextValue {
  requirements: Requirement[];
  loading: boolean;
  addRequirement: (input: RequirementInput) => Requirement;
  updateRequirement: (id: string, input: RequirementInput) => void;
  changeStatus: (id: string, status: RequirementStatus) => void;
  removeRequirement: (id: string) => void;
  resetDemo: () => void;
}

const RequirementContext = createContext<RequirementContextValue | null>(null);

const loadInitial = (): Requirement[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Requirement[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    logger.error('读取本地需求数据失败，回退示例数据', error);
  }
  return buildSeedRequirements();
};

export const RequirementProvider = ({ children }: { children: ReactNode }) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRequirements(loadInitial());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requirements));
    } catch (error) {
      logger.error('写入本地需求数据失败', error);
    }
  }, [requirements, loading]);

  const addRequirement = useCallback((input: RequirementInput): Requirement => {
    const now = Date.now();
    const created: Requirement = {
      ...input,
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `req-${now}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    setRequirements((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateRequirement = useCallback(
    (id: string, input: RequirementInput) => {
      setRequirements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...input, updatedAt: Date.now() } : item,
        ),
      );
    },
    [],
  );

  const changeStatus = useCallback((id: string, status: RequirementStatus) => {
    setRequirements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, updatedAt: Date.now() } : item,
      ),
    );
  }, []);

  const removeRequirement = useCallback((id: string) => {
    setRequirements((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetDemo = useCallback(() => {
    setRequirements(buildSeedRequirements());
  }, []);

  const value = useMemo<RequirementContextValue>(
    () => ({
      requirements,
      loading,
      addRequirement,
      updateRequirement,
      changeStatus,
      removeRequirement,
      resetDemo,
    }),
    [
      requirements,
      loading,
      addRequirement,
      updateRequirement,
      changeStatus,
      removeRequirement,
      resetDemo,
    ],
  );

  return (
    <RequirementContext.Provider value={value}>
      {children}
    </RequirementContext.Provider>
  );
};

export const useRequirements = (): RequirementContextValue => {
  const ctx = useContext(RequirementContext);
  if (!ctx) {
    throw new Error('useRequirements 必须在 RequirementProvider 内使用');
  }
  return ctx;
};
