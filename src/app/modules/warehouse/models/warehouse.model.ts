import { AddressModel } from '@/modules/location/components/address/address.model';
import { BaseModel } from '@/models/BaseModel';
import { LocationModel } from '@/models/location.model';

export class WarehouseDetailServiceModel extends BaseModel {
    serviceId?: string;
    price?: number;
}

export class WarehouseDetailPriceByTimeline extends BaseModel {
    pricingTimelineId?: string;
    price?: number;
}

export class WarehouseDetailSize extends BaseModel {
    width?: number;
    height?: number;
}

export class WarehouseModel extends BaseModel {

    code?: string;
    status?: number;
    name?: string;
    phone?: string;
    email?: string;
    address?: AddressModel = new AddressModel();
    mapAddress?: string;
    location?: LocationModel = new LocationModel();
    summary?: string;
    description?: string;
    images?: string[];
    fireProtectLicenseImages?: string[];
    warehouseMapImages?: string[];
    contractImages?: string[];

    typeIds?: string[];
    startedAt?: number;
    area?: number;
    availableArea?: number;
    length?: number;
    width?: number;
    services?: WarehouseDetailServiceModel[] = [];
    utilityIds?: string[] = [];
    directions?: string[];
    price?: number;
    priceByTimelines?: WarehouseDetailPriceByTimeline[] = [];
    userId?: string;
    staffIds?: string[];
    numberOfOrders?: number;
    createdBy?: string;
    updatedBy?: string;
    size?: WarehouseDetailSize;

    constructor(item = null) {
        super(item);
    }

    infoFields() {
        return ['name', 'phone', 'email', 'address', 'mapAddress',
            'location', 'summary', 'description', 'images', 'fireProtectLicenseImages',
            'warehouseMapImages', 'contractImages'];
    }

    serviceUtilityFields() {
        return [
            'area',
            'availableArea',
            'size',
            'directions',
            'utilityIds',
            'services',
            'priceByTimelines',
            'userId',
            'staffIds',
            'price'
        ];
    }
}
