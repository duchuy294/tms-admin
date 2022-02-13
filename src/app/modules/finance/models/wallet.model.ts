import { BaseModel } from '@/models/BaseModel';

export class WalletModel extends BaseModel {
  _id: string;
  userId: string;
  userType: string;
  usedBalance = 0;
  mainBalance = 0;
  subBalance = 0;
  collectionDebt = 0;
  minWithdraw = 0;
  maxWithdraw = 0;
  minRemaining = 0;
  confirmedCOD = 0;
  currency?: string = 'VND';
  depositBalance = 0;
  postPay?: boolean;
  updatedBy?: string;
}
