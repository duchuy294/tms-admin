import { BaseModel } from '@/models/BaseModel';

export class WalletEditModel extends BaseModel {
  minWithdraw = 0;
  maxWithdraw = 0;
  minRemaining = 0;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}
