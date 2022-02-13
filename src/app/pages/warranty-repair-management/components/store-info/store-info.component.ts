import { Component, Input } from '@angular/core';
import { CreateStore } from '@/modules/warranty-repair/models/create-store.model';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'store-info',
    templateUrl: './store-info.component.html',
    styleUrls: ['./store-info.component.less']
})
export class StoreInfoComponent {
    modelQuery: CreateStore;
    servicerData: Servicer;
    @Input()
    set model(value: CreateStore) {
        this.modelQuery = value;
        if (this.modelQuery.owner) {
            (async () => {
                this.loadOwner();
            })();
        }
    }
    constructor(private servicerService: ServicerService) { }

    async loadOwner() {
        this.servicerData = await this.servicerService.get(
            this.modelQuery.owner
        );
    }
}
