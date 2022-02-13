import { BaseModel } from '@/models/BaseModel';
import { LocationModel } from '@/models/location.model';

class Contact {
    name?: string;
    phone?: string;

    public mapFields(item) {
        if (item) {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    this[key] = item[key];
                }
            }
        }
    }
}

export class WarehouseContactModel extends BaseModel {
    code?: string;
    userId?: string;
    renterContact?: Contact = new Contact();
    warehouseId?: string;
    location?: LocationModel = new LocationModel();
    hostId?: string;
    hostContact?: Contact = new Contact();
    rentArea?: number;
    startedAt?: number;
    finishedAt?: number;
    note?: string;
    status?: number;
    adminNote?: string;
    resultNote?: string;
    processedBy?: string;
    processedAt?: number;
    createdBy?: string;
    updatedBy?: string;
    contactId?: string;
}