import { BaseModel } from 'app/models/BaseModel';

export class CollectionFeeModel extends BaseModel {
  to = 0;
  toFormatted?: string;
  price = 0;
  userPrice = 0;
  servicerPrice = 0;
  commission = 0;
  changed?: boolean;
  rate = 0;
  userRate = 0;
  servicerRate = 0;
}
