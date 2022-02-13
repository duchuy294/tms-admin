import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output
    } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { QueryModel } from '@/models/query.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
    selector: 'warehouse-area-modal',
    templateUrl: './warehouse-area-modal.component.html',
    styleUrls: ['./warehouse-area-modal.component.less']
})
export class WarehouseAreaModalComponent implements OnChanges {
    @Input() visible = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    data: { [_date: string]: number } = {};
    id = this.route.snapshot.paramMap.get('id');
    currentFirstDateOfMonth = DateTimeService.convertDateToTimestamp(DateTimeService.getFirstDateOfMonth());
    currentMonth = [];
    private onLoad = _.debounce((date) => {
        this.data = {};
        this.loadData(date);
    }, 500);

    constructor(
        private warehouseService: WarehouseService,
        private route: ActivatedRoute
    ) { }

    async ngOnChanges() {
        if (this.visible) {
            this.data = {};
            await this.loadData();
        }
    }

    async loadData(date: Date = new Date()) {
        this.currentMonth = [
            DateTimeService.convertDateToTimestamp(DateTimeService.getFirstDateOfMonth(date)),
            DateTimeService.convertDateToTimestamp(DateTimeService.getLastDateOfMonth(date))
        ];
        const response = await this.warehouseService.filterAvailableAreaSummary(new QueryModel({
            startTime: this.convertDateToTimestamp(date),
            warehouseId: this.id,
            endTime: this.convertDateToTimestamp(DateTimeService.getLastDateOfMonth(date))
        }));
        _.forEach(response, item => {
            this.data[item.date] = item.area;
        });
    }

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }

    async onChange(event) {
        const selectedDate = DateTimeService.convertDateToTimestamp(event);
        const firstDate = DateTimeService.getFirstDateOfMonth(event);
        if (selectedDate >= this.currentFirstDateOfMonth
            && (selectedDate < this.currentMonth[0] || selectedDate > this.currentMonth[1])) {
            this.onLoad(DateTimeService.convertDateToTimestamp(firstDate) > DateTimeService.convertDateToTimestamp(new Date())
                ? firstDate : new Date());
        }
    }

    convertDateToTimestamp(item) {
        return DateTimeService.convertDateToTimestamp(item);
    }

    isNil(item) {
        return _.isNil(item);
    }
}