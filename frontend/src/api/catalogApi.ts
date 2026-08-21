import { apiClient } from './client';
import { ServiceResult } from '../types/api';
import { Brand, Category, Department, Employee } from '../types/catalog';

// Helper genérico para los controladores CRUD derivados de CrudController<T>
const createCatalogApi = <T extends { id: number }>(endpoint: string) => ({
  getAll: async (): Promise<ServiceResult<T[]>> => {
    const response = await apiClient.get<ServiceResult<T[]>>(`/api/${endpoint}`);
    return response.data;
  },
  getById: async (id: number): Promise<ServiceResult<T>> => {
    const response = await apiClient.get<ServiceResult<T>>(`/api/${endpoint}/${id}`);
    return response.data;
  },
  create: async (data: Omit<T, 'id'>): Promise<ServiceResult<T>> => {
    const response = await apiClient.post<ServiceResult<T>>(`/api/${endpoint}`, data);
    return response.data;
  },
  update: async (id: number, data: T): Promise<ServiceResult<T>> => {
    const response = await apiClient.put<ServiceResult<T>>(`/api/${endpoint}/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<ServiceResult<boolean>> => {
    const response = await apiClient.delete<ServiceResult<boolean>>(`/api/${endpoint}/${id}`);
    return response.data;
  },
});

export const categoriesApi = createCatalogApi<Category>('categories');
export const brandsApi = createCatalogApi<Brand>('brands');
export const departmentsApi = createCatalogApi<Department>('departments');
export const employeesApi = createCatalogApi<Employee>('employees');
