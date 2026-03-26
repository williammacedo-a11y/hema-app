import { apiFetch, ApiResponse } from './api';

export interface Category {
  id: string;
  name: string;
}

export const CategoryBadgesService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiFetch<Category[]>('/categories', { method: 'GET' });
  }
};