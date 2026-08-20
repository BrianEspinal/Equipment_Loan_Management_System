import { apiClient } from './client';
import { ServiceResult } from '../types/api';
import { CreateEquipmentDto, EquipmentDto, UpdateEquipmentDto } from '../types/equipment';

export const equipmentApi = {
  getAll: async (): Promise<ServiceResult<EquipmentDto[]>> => {
    const response = await apiClient.get<ServiceResult<EquipmentDto[]>>('/equipment');
    return response.data;
  },

  getAvailable: async (): Promise<ServiceResult<EquipmentDto[]>> => {
    const response = await apiClient.get<ServiceResult<EquipmentDto[]>>('/equipment/available');
    return response.data;
  },

  getById: async (id: number): Promise<ServiceResult<EquipmentDto>> => {
    const response = await apiClient.get<ServiceResult<EquipmentDto>>(`/equipment/${id}`);
    return response.data;
  },

  create: async (dto: CreateEquipmentDto): Promise<ServiceResult<EquipmentDto>> => {
    const response = await apiClient.post<ServiceResult<EquipmentDto>>('/equipment', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateEquipmentDto): Promise<ServiceResult<EquipmentDto>> => {
    const response = await apiClient.put<ServiceResult<EquipmentDto>>(`/equipment/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<ServiceResult<boolean>> => {
    const response = await apiClient.delete<ServiceResult<boolean>>(`/equipment/${id}`);
    return response.data;
  },
};
