export interface LoanDto {
  id: number;
  equipmentId: number;
  equipmentName: string;
  employeeId: number;
  employeeName: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string | null;
  status: string;
  notes?: string | null;
}

export interface CreateLoanDto {
  equipmentId: number;
  employeeId: number;
  expectedReturnDate: string;
  notes?: string | null;
  approvedByUserId?: number | null;
}

export interface ReturnLoanDto {
  actualReturnDate?: string | null;
  notes?: string | null;
}
