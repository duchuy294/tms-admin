import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
@Component({
  selector: 'value-input',
  templateUrl: 'value-input.component.html'
})
export class ValueInputComponent {
  @Input() public obj = { value: 0 };
  @Input() public unit: any = 'vnđ';
  @Input() public showOnly = false;
  @Input() public valueType = 'integer';
  @Output() public changeValue = new EventEmitter<any>();

  async onChange(event: any) {
    if (this.valueType === 'float') {
      this.changeValue.emit(parseFloat(event.target.value));
    } else {
      this.changeValue.emit(parseInt(event.target.value));
    }
  }
}
