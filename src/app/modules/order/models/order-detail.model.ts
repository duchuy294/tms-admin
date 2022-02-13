import { PointModel } from 'app/modules/order/models/point.model';

export class OrderDetailModel {
    points?: PointModel[];
    images?: string[] = [];
    vehicleTypeId?: string;
}