import { BaseModel } from '@/models/BaseModel';

export class StoreModel extends BaseModel {
  _id?: string;
  name?: string;
  images?: string[];
  authorizedBy?: string[];
  productTypeIds?: string[];
  description?: string;
  phone?: string;
  address?: string;
  createdAt?: number;
  code?: string;
  rate?: number;
  rateTimes?: number;
  isMember?: boolean;
  updatedAt: number;
  brandIds?: string[];
  staffIds?: string[];
  owner: string;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}