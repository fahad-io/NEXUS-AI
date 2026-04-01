'use client';
import { useState, useEffect } from 'react';
import { AIModel } from '@/types';
import { modelsApi } from '@/lib/api';
import { FALLBACK_MODELS } from '@/lib/models-fallback';

export function useModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modelsApi.getAll()
      .then(res => setModels(res.data))
      .catch(() => setModels(FALLBACK_MODELS))
      .finally(() => setLoading(false));
  }, []);

  const getModelById = (id: string) => models.find(m => m.id === id);

  return { models, loading, getModelById };
}
