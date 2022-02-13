import { QueryModel } from '@/models/query.model';

export class DashboardStatisticsQueryModel extends QueryModel {
  servicerCodes?: string;
  state?: string = 'online';
  servicerStatus?: string = '';
  bounds?: string;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}