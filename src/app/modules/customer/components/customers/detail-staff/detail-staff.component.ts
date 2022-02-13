import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'detail-staff',
  templateUrl: './detail-staff.component.html',
  styleUrls: ['./detail-staff.component.less']
})
export class DetailStaffComponent {
  visibleModal: boolean = false;
  enterpriseId: string = null;

  @Input()
  set visible(value: boolean) {
    this.visibleModal = value;
  }

  @Input()
  set giveEnterpriseId(value) {
    this.enterpriseId = value;
  }

  @Output() handleVisible = new EventEmitter<boolean>();

  handleVisibleModal(flag: boolean) {
    this.handleVisible.emit(!!flag);
  }

}
