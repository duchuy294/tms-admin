import { BaseModel } from 'app/models/BaseModel';
import { Servicer } from '../servicer/servicer.model';

export class GroupServicer extends BaseModel {
    code: string;
    name: string;
    status: string;
    numberOfOrders: number;
    numberOfMembers: number;
    members: Servicer[] = [];
}
