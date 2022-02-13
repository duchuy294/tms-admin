import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactStatus } from '@/constants/ContactStatus';
import { Profile } from '@/modules/profile/models/profile.model';
import { WarehouseContactModel } from '@/modules/warehouse/models/warehouse-contact.model';

@Component({
  selector: 'warehouse-contact-detail-services',
  templateUrl: './warehouse-contact-detail-services.component.html',
  styleUrls: ['./warehouse-contact-detail-services.component.less']
})
export class WarehouseContactDetailServicesComponent {
  @Input() contact: WarehouseContactModel = new WarehouseContactModel();
  @Input() loading: boolean = false;
  @Output() reload = new EventEmitter();
  @Input() currentUser: Profile;
  visibleAction = false;
  actionType: number;
  ContactStatus = ContactStatus;


  get isWatingToConfirm() {
    return this.contact.status === ContactStatus.WatingToConfirm;
  }

  get isCompleted() {
    return this.contact.status === ContactStatus.Completed;
  }

  get isFail() {
    return this.contact.status === ContactStatus.Fail;
  }

  handleVisible(flag = true) {
    this.visibleAction = !!flag;
  }

  toggleAction(action) {
    this.actionType = action;
    this.handleVisible();
  }

  submit() {
    this.handleVisible(false);
    this.reload.emit();
  }
  checkAuthority() {
    return this.currentUser && this.currentUser._id === this.contact.processedBy;
  }
}
