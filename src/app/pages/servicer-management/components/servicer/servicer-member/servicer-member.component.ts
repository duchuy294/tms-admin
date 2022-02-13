import * as _ from 'lodash';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Servicer } from '../../../../../modules/servicer/models/servicer/servicer.model';

@Component({
    selector: 'servicer-member',
    templateUrl: 'servicer-member.component.html',
    styleUrls: ['./servicer-member.less']
})
export class ServicerMemberComponent {
    @Input() servicer: Servicer;
    visibleModal: boolean = false;

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    handleVisibleModal(flag: boolean = false) {
        this.handleVisible.emit(!!flag);
    }
}