import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { ConditionOperator } from '@/utility/constants/Condition/ConditionOperator.enum';
import { ConditionType } from '@/utility/constants/Condition/ConditionType.enum';

@Component({
    selector: 'condition',
    templateUrl: './condition.component.html',
    styleUrls: ['./condition.component.less']
})

export class ConditionComponent implements OnInit {
    @Input() title = '';
    @Input() type = '';
    @Input() model = {};

    @Output() onRemove = new EventEmitter();
    @Output() onChange = new EventEmitter<Object>();

    ngOnInit() {
        switch (this.type) {
            case ConditionType.EXACT_NUMBER:
                this.model['value'] = (this.model['value']) ? this.model['value'] : 1;
                this.model['operator'] = ConditionOperator.EQUAL;
                break;
        }
        this.onChange.emit(this.model);
    }

    ngModelChange() {
        this.onChange.emit(this.model);
    }

    onClickRemove() {
        this.onRemove.emit();
    }
}