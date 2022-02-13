import * as _ from 'lodash';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { condition } from '@/utility/constants/Condition/Condition.const';

@Component({
    selector: 'condition-management',
    templateUrl: './condition-management.component.html',
    styleUrls: ['./condition-management.component.less']
})

export class ConditionManagementComponent implements OnInit {
    @Input() model = {};
    @Input() condition = [];
    @Input() numberOfCol = 3;
    @Output() onChange = new EventEmitter<Object>();

    conditionList = [
        condition.numberOfOrder
    ];
    _condition = condition;
    selectedCondition = null;

    ngOnInit() {
        if (!_.isEmpty(this.condition)) {
            this.conditionList = _.filter(this.conditionList, (item) => {
                const result = _.filter(this.condition, conditionItem => _.isEqual(item, conditionItem));
                return !_.isEmpty(result);
            });
        }
    }

    removeCondition(item) {
        delete this.model[item.title];
        this.onChange.emit(this.model);
    }

    addOneCondition(selectedCondition) {
        if (selectedCondition && !this.model.hasOwnProperty(selectedCondition.title)) {
            this.model[selectedCondition.title] = {};
            this.onChange.emit(this.model);
        }
        this.selectedCondition = null;
    }

    addAllCondition() {
        _.forEach(this.conditionList, (item) => {
            if (!this.model.hasOwnProperty(item.title)) {
                this.addOneCondition(item);
            }
        });
    }
}