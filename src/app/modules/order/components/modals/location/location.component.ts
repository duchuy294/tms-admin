import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { FlatLocationModel, LocationLevel } from '@/modules/location/components/address/address.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.less']
})

export class LocationComponent {
    constructor(
        private locationService: LocationService,
    ) {
        
    }
    @Input() visibleModal: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    cityOptions: FlatLocationModel[] = [];
    districtOptions: FlatLocationModel[] = [];

    checkinstallationPoint = true;
    checkDeliveryPoint = false;
    citis = [];
    districts = [];
    wards = [];

    async ngOnInit() {
        const citis = await this.locationService.filter(new QueryModel({ level: LocationLevel.CITY, limit: 500 }));
        this.cityOptions = citis.data;
        const districts = await this.locationService.filter(new QueryModel({ level: LocationLevel.DISTRICT, limit: 500 }));
        this.districtOptions = districts.data;
    }

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }

}