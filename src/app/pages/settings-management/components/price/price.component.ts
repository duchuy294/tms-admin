import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PriceFormService } from 'app/modules/price/services/price-form.service';

@Component({
    selector: 'price',
    templateUrl: 'price.component.html'
})
export class PriceComponent implements OnInit {
    public priceFormId;
    public priceForm;
    constructor(private priceFormService: PriceFormService, private route: ActivatedRoute) { }

    async ngOnInit() {
        this.priceFormId = this.route.snapshot.paramMap.get('id');
        this.priceForm = await this.priceFormService.get(this.priceFormId);
    }

    async savePriceForm() {
        this.priceFormService.update(this.priceForm);
    }
}
