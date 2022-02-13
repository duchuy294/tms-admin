import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserStatus } from './../../../../constants/UserStatus';

@Component({
    selector: 'status',
    templateUrl: 'status.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => StatusComponent), // tslint:disable-line
        multi: true
    }]
})
export class StatusComponent implements ControlValueAccessor {
    _value: string;
    propagateChange: (value: any) => void;
    @Input() class = '';
    @Input() hasAll = true;
    public statues: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];

    writeValue(value: any) {
        this._value = value;
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn) {
        this.propagateChange = fn;
    }

    change() {
        if (this.propagateChange) {
            this.propagateChange(this._value);
        }
    }
}
