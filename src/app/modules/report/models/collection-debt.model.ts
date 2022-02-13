import { BaseModel } from '@/models/BaseModel';

export class CollectionDebtModel extends BaseModel {
  phone?: string;
  deposit?: number;
  teams?: string;
  vehicles?: string;
  code: string;
  collectionDebt?: number;

  constructor(item = null) {
    super(item);
  }
}