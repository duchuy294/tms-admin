import { AddressModel } from '@/modules/location/components/address/address.model';
import { BaseModel } from 'app/models/BaseModel';
import { LocationModel } from 'app/models/location.model';

export class ReturnWarehouseModel extends BaseModel {
  name: string;
  order: Number = 0;
  address = new AddressModel();
  mapAddress: string;
  location = new LocationModel();
  createdBy: string;
  updatedBy: string;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}
