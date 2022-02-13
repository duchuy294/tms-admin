import { BaseModel } from '@/models/BaseModel';

export class ServicerModel extends BaseModel {
  servicer?: any;
  incidentTime?: number;
  collectionTime?: number;
  collectionDebt?: number;

  constructor(item = null) {
    super(item);
  }
}