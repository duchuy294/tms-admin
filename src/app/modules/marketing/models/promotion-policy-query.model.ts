import { QueryModel } from '@/models/query.model';

export class PromotionPolicyQueryModel extends QueryModel {
  name: string;
  priority: number;
  effectedAt: number;
  expiredAt: number;
  content: string;
  createdBy: string;
  code: string;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}