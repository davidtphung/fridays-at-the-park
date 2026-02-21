'use client';

import { useQueueStore } from '@/stores/queueStore';

export function useQueue() {
  return useQueueStore();
}
