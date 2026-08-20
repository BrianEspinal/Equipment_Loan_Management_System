export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Brand {
  id: number;
  name: string;
  description?: string | null;
}

export interface Department {
  id: number;
  name: string;
  description?: string | null;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
}
