import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { NgForm } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'input-currency',
  templateUrl: './input-currency.component.html',
})
export class InputCurrencyComponent {
  @Input() model: number;
  @Input() placeholder: string = '';
  @Input() suffix: string = null;
  @Input() modelOptions = { standalone: true };
  @Input() required: boolean = false;
  @Output() modelChange = new EventEmitter();
  @ViewChild('valueRef') valueRef: NgForm;
  numberMask = createNumberMask({ prefix: '', allowNegative: true });
  _amount: string = null;

  get amount() {
    if (this._amount === null) {
      this._amount = this.model ? this.model.toString() : '';
    }
    return this._amount;
  }

  set amount(value) {
    this._amount = value;
    this.modelChange.emit(CommonHelper.parseS2N(value));
  }

  error() {
    if (this.valueRef && this.required) {
      return ((this.valueRef.dirty || this.valueRef.touched) && _.isEmpty(this._amount)) || !this._amount;
    }
    return false;
  }

  valid() {
    return !this.error();
  }

  reset() {
    this._amount = null;
  }
}
