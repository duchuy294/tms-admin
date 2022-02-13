import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { ReferralPolicyModel } from '@/modules/referral/models/referral-policy.model';

@Component({
    selector: 'referral-detail',
    templateUrl: './referral-detail.component.html',
    styleUrls: ['./referral-detail.component.less']
})
export class ReferralDetailComponent {
    @Input() model = new ReferralPolicyModel();
    @Output() modify = new EventEmitter();

    handleEdit() {
        this.modify.emit();
    }
}