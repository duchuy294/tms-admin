import { BaseModel } from '@/models/BaseModel';

export class OrdersModel extends BaseModel {
  serviceType?: string;
  userId?: string;
  userCost?: number;
  baseUserCost?: number;
  servicerCost?: number;
  status?: number;
  code?: string;
  servicerId?: string;
  serviceName?: string;
  icon?: string;
  statusLabel?: string;
  user?: any;
  servicer?: any;
  services?: string;

  constructor(item = null) {
    super(item);
  }
}