import { QueryModel } from '../../../models/query.model';
import { ServicerType } from '../../../constants/ServicerType';

export class GetMemberQueryModel extends QueryModel {
    enterpriseId: string;
    type: ServicerType;
}
