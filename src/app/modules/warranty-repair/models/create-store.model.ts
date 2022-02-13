import { BaseModel } from '@/models/BaseModel';

export class CreateStore extends BaseModel {
    isMember?: boolean = true;
    name?: string;
    code?: string;
    location?: any;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
    rate?: number;
    ward?: string;
    address?: string;
    description?: string;
    descriptionDetail?: string;
    images?: string[] = [];
    verifiedCertificateImages?: string[] = [];
    businessCertificateImages?: string[] = [];
    contractImages?: string[] = [];
    groupId?: string;
    teamId?: string;
    teamIds?: string[] = [];
    authorizedBrands?: object;
    unauthorizedBrands?: object;
    owner?: string;
    openTime?: string;
    closeTime?: string;
    workingHours?: any;
    status?: number;
    staffIds?: string[] = [];
    mapAddress?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
