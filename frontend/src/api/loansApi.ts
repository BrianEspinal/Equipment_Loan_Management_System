import { apiClient } from './client';
import { ServiceResult } from '../types/api';
import { CreateLoanDto, LoanDto, ReturnLoanDto } from '../types/loan';

export const loansApi = {
  getAll: async (): Promise<ServiceResult<LoanDto[]>> => {
    const response = await apiClient.get<ServiceResult<LoanDto[]>>('/api/loans');
    return response.data;
  },

  getActive: async (): Promise<ServiceResult<LoanDto[]>> => {
    const response = await apiClient.get<ServiceResult<LoanDto[]>>('/api/loans/active');
    return response.data;
  },

  getById: async (id: number): Promise<ServiceResult<LoanDto>> => {
    const response = await apiClient.get<ServiceResult<LoanDto>>(`/api/loans/${id}`);
    return response.data;
  },

  create: async (dto: CreateLoanDto): Promise<ServiceResult<LoanDto>> => {
    const response = await apiClient.post<ServiceResult<LoanDto>>('/api/loans', dto);
    return response.data;
  },

  returnLoan: async (id: number, dto: ReturnLoanDto): Promise<ServiceResult<LoanDto>> => {
    const response = await apiClient.put<ServiceResult<LoanDto>>(`/api/loans/${id}/return`, dto);
    return response.data;
  },
};
