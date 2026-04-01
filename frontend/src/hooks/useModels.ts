'use client';
import { useState, useEffect } from 'react';
import { AIModel } from '@/types';
import { modelsApi } from '@/lib/api';
import { getCachedValue, setCachedValue } from '@/lib/cache';
import { FALLBACK_MODELS } from '@/lib/models-fallback';

const MODELS_CACHE_KEY = 'nexusai_models_cache';
const MODELS_CACHE_TTL_MS = 15 * 60 * 1000;

export function useModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedModels = getCachedValue<AIModel[]>(MODELS_CACHE_KEY);
    if (cachedModels?.length) {
      setModels(cachedModels);
      setLoading(false);
    }

    modelsApi.getAll()
      .then(res => {
        setModels(res.data);
        setCachedValue(MODELS_CACHE_KEY, res.data, { ttlMs: MODELS_CACHE_TTL_MS });
      })
      .catch(() => {
        setModels(cachedModels?.length ? cachedModels : FALLBACK_MODELS);
      })
      .finally(() => setLoading(false));
  }, []);

  const getModelById = (id: string) => models.find(m => m.id === id);

  return { models, loading, getModelById };
}
