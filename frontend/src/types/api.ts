export interface ServiceResult<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors: string[];
}
