import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SmsLogModel } from '@/modules/telecom/models/sms-log.model';

@Component({
  selector: 'sms-log-detail',
  templateUrl: './sms-log-detail.component.html',
  styleUrls: ['./sms-log-detail.component.less']
})
export class SmsLogDetailComponent {
  @Input() smsLogModel: SmsLogModel = new SmsLogModel();
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter();

  handleVisibleModal(flag = true) {
    this.handleVisible.emit(!!flag);
  }
}
