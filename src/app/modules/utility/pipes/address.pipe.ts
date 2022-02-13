import { AddressModel } from '@/modules/location/components/address/address.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'address'
})
export class AddressPipe implements PipeTransform {
    transform(value: AddressModel): any {
        const arr = [];
        if (value && value.street) {
            arr.push(value.street);
        }
        if (value && value.ward) {
            arr.push(value.ward);
        }
        if (value && value.district) {
            arr.push(value.district);
        }
        if (value && value.city) {
            arr.push(value.city);
        }
        return arr.join(', ');
    }
}
