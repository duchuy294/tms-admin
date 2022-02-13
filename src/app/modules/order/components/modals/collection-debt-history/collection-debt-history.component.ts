import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';

@Component({
    selector: 'collection-debt-history',
    templateUrl: './collection-debt-history.component.html',
    styleUrls: ['./collection-debt-history.component.less']
})

export class CollectionDebtHistoryComponent {
    visibleModal: boolean = false;
    customerId: string[] = [];
    unsubmittedMoney: number = 0;
    modelCurrency: string = 'VND';
    collectionDebt: number = 0;

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set userId(value) {
        this.customerId = value;
    }

    @Input()
    set setCollectionDebt(value) {
        this.collectionDebt = value;
    }

    @Input()
    set currency(value) {
        this.modelCurrency = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }

}