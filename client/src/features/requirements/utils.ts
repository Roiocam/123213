import dayjs from 'dayjs';

import type { Requirement, RequirementFilters } from './types';

export const formatDate = (value: string | null): string =>
  value ? dayjs(value).format('YYYY-MM-DD') : '—';

export const isOverdue = (item: Requirement): boolean => {
  if (!item.dueDate || item.status === 'done') return false;
  return dayjs(item.dueDate).endOf('day').isBefore(dayjs());
};

export const isDueSoon = (item: Requirement): boolean => {
  if (!item.dueDate || item.status === 'done' || isOverdue(item)) return false;
  const diff = dayjs(item.dueDate).startOf('day').diff(dayjs().startOf('day'), 'day');
  return diff <= 2;
};

export const emptyFilters: RequirementFilters = {
  keyword: '',
  project: 'all',
  type: 'all',
  priority: 'all',
  status: 'all',
  owner: 'all',
};

export const filterRequirements = (
  items: Requirement[],
  filters: RequirementFilters,
): Requirement[] => {
  const keyword = filters.keyword.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.project !== 'all' && item.project !== filters.project) return false;
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.priority !== 'all' && item.priority !== filters.priority) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.owner !== 'all' && item.owner !== filters.owner) return false;
    if (keyword) {
      const haystack = [
        item.title,
        item.description,
        item.project,
        item.owner,
        item.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });
};
