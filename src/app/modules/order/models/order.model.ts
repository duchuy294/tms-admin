import { BaseModel } from 'app/models/BaseModel';
import { CostDetail } from './cost-detail.model';
import { OrderCODModel } from './order-cod.model';
import { OrderDetailModel } from './order-detail.model';
import { ProductModel } from './product.model';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { UnreadConversationModel } from './unread-conversation.model';

export class OrderModel extends BaseModel {
    _id?: string;
    code?: string;
    cod = new OrderCODModel();
    promotionCode?: string;
    paymentMethod?: string;
    serviceType?: string;
    servicerId?: string;
    services?: ServiceModel[];
    userId?: string;
    userEnterpriseId?: string;
    adminId?: string;
    userCost?: number;
    servicerCost?: number;
    baseUserCost?: number;
    realCost?: number;
    status?: number;
    statusLabel?: string;
    createdAt?: any;
    note?: string;
    detail?: OrderDetailModel;
    adminNote?: string;
    costDetail?: CostDetail[] = [];
    servicerCostDetail: CostDetail[] = [];
    finishedAt?: number;
    acceptedAt?: number;
    products?: ProductModel[] = [];
    conversations?: UnreadConversationModel[] = [];
    transCode?: string;
    operatorId?: string;
    prePaid?: number;
    processedBy?: string;
    processedAt?: string;
    warehouseId?: string;
    hostId?: string;
    rentArea?: number;
    cost?: number;
    commission?: number;
    cancelReason?: string;
    cancelBy?: string;
    externalCode?: string;
    size: {
        length?: number;
        width?: number;
        height?: number;
        volume?: number;
    };
    weight?: number;
    deliveryType?: string;
    expectedTime?: number;
    clientBranchId?: string;
    packages?: any;
    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
