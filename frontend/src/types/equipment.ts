export interface EquipmentDto {
  id: number;
  inventoryCode: string;
  name: string;
  model?: string | null;
  serialNumber?: string | null;
  status: string;
  description?: string | null;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
}

export interface CreateEquipmentDto {
  inventoryCode: string;
  name: string;
  model?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  categoryId: number;
  brandId: number;
}

export interface UpdateEquipmentDto {
  id: number;
  inventoryCode: string;
  name: string;
  model?: string | null;
  serialNumber?: string | null;
  status: string;
  description?: string | null;
  categoryId: number;
  brandId: number;
}
