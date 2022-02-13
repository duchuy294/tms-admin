import { QueryModel } from '../../../models/query.model';

export class GetBalanceQueryModel extends QueryModel {
    action = null;
    status: any = null;
    userType = null;
    type?: string = null;
}
