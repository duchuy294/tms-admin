import { QueryModel } from '@/models/query.model';

export class ReportOverviewQueryModel extends QueryModel {
  from?: number;
  to?: number;
  weekFrom?: number;
  weekTo?: number;
  quarterFrom?: number;
  quarterTo?: number;
  yearFrom?: number;
  yearTo?: number;
  monthFrom?: number;
  monthTo?: number;
  dateType?: string = 'month';

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}