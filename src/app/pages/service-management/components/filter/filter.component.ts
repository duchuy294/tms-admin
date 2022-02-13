import * as _ from 'lodash';
import { CollectionFilterType } from './../../constants/collection-filter-type';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { OrderStatus } from 'app/constants/OrderStatus';
import { QueryModel } from '../../../../models/query.model';
import { Servicer } from '../../../../modules/servicer/models/servicer/servicer.model';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() visibles = [];
    model = new QueryModel({ hasIncident: 1 });
    collectionFilterTypes = [CollectionFilterType.ALL, CollectionFilterType.UNFINISHED_ORDER, CollectionFilterType.FINISHED_ORDER, CollectionFilterType.UNFINISHED_SUBMIT, CollectionFilterType.FINISHED_SUBMIT];
    collectionFilterType = CollectionFilterType.ALL;
    private _endTime: Date;
    private _startTime: Date;

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(start) {
        this._startTime = start;
        this.model.startTime = start ? DateTimeService.convertDateToTimestamp(this._startTime) : null;
    }

    get endTime(): Date {
        return this._endTime;
    }

    set endTime(end) {
        this._endTime = end;
        this.model.endTime = end ? DateTimeService.convertDateToTimestamp(this._endTime, null, true) : null;
    }


    searchEvent() {
        this.search.emit(this.model);
    }

    onSelectServicers(servicers: Servicer[]) {
        this.model.servicerId = _.map(servicers, x => x._id).join(',');
        this.searchEvent();
    }

    onCollectionFilterTypeChange() {
        switch (this.collectionFilterType) {
            case CollectionFilterType.ALL:
                this.model = new QueryModel(_.omit(this.model, ['status', 'submitted']));
                break;

            case CollectionFilterType.UNFINISHED_ORDER:
                this.model = _.omit(this.model, ['submitted']) as QueryModel;
                this.model.status = `${OrderStatus.InProgress},${OrderStatus.Return}`;
                this.model = new QueryModel(this.model);
                break;

            case CollectionFilterType.FINISHED_ORDER:
                this.model = _.omit(this.model, ['submitted']) as QueryModel;
                this.model.status = `${OrderStatus.Finished},${OrderStatus.Incident},${OrderStatus.ProcessingIncident}`;
                this.model = new QueryModel(this.model);
                break;

            case CollectionFilterType.UNFINISHED_SUBMIT:
                _.assignIn(this.model, {
                    status: `${OrderStatus.Finished},${OrderStatus.Incident},${OrderStatus.ProcessingIncident}`,
                    submitted: 'apart,none'
                });

                break;

            case CollectionFilterType.FINISHED_SUBMIT:
                _.assignIn(this.model, {
                    status: `${OrderStatus.Finished},${OrderStatus.Incident},${OrderStatus.ProcessingIncident}`,
                    submitted: 'full'
                });

                break;
        }
    }
}
