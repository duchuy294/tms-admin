import * as _ from 'lodash';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { OrderStatus } from '@/constants/OrderStatus';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'order-status-filter',
    templateUrl: './order-status-filter.component.html',
    styleUrls: ['./order-status-filter.component.less']
})
export class OrderStatusFilterComponent implements OnInit {
    @Input()
    get model() {
        return this.currentModel;
    }

    set model(value) {
        this.currentModel = value;
        this.modelChange.emit(this.currentModel);
    }
    @Input() data = [];

    @Output() modelChange = new EventEmitter();
    @Output() onSelect = new EventEmitter();

    currentModel = new QueryModel();
    colors: { [statusCode: string]: string } = {};
    selectedStatus;
    cancelledStatus = `${OrderStatus.CanceledByUser},${OrderStatus.CanceledByServicer},${OrderStatus.CanceledByAdmin},${OrderStatus.CanceledByRenter},${OrderStatus.CanceledByLessor}`;

    ngOnInit() {
        _.forEach(this.data, item => {
            this.colors[item.name] = '';
        });
        this.selectedStatus = this.data[0].name;
        this.colors[this.selectedStatus] = 'red';
    }

    onSelectStatus(item) {
        this.colors[this.selectedStatus] = '';
        this.selectedStatus = item.name;
        this.colors[this.selectedStatus] = 'red';
        this.model = item.query;
        this.onSelect.emit();
    }

    reset() {
        this.colors[this.selectedStatus] = '';
        this.selectedStatus = this.data[0].name;
        this.colors[this.selectedStatus] = '';
    }
}