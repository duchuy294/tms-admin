import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { BaseModalComponent } from '../../../../components/base-modal.component';
import { TADModel } from 'app/modules/marketing/models/TAD.model';
import { FAQService } from 'app/modules/marketing/services/faq.service';

@Component({
    selector: 'faq-modal',
    templateUrl: 'faq-modal.component.html'
})
export class FAQModalComponent extends BaseModalComponent {
    public model = new TADModel();
    public error = new TADModel();

    constructor(public activeModal: NgbActiveModal, public faqService: FAQService) {
        super(activeModal);
    }

    async confirm() {
        const response = this.model._id ? await this.faqService.update(this.model) : await this.faqService.create(this.model);

        if (response.errorCode === 0) {
            this.close();
            await this.callSuccessCallback();
        } else {
            this.error = this.faqService.parseErrorData(response.data);
        }
    }
}
