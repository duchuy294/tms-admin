import * as _ from 'lodash';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CONTACT_STATUS_COLOR } from '@/constants/ContactStatus';
import { WarehouseContactModel } from '@/modules/warehouse/models/warehouse-contact.model';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseOrderHistoryComponent } from './../../../warehouse-order/warehouse-order-history/warehouse-order-history.component';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
  selector: 'warehouse-contact-detail-information',
  templateUrl: './warehouse-contact-detail-information.component.html',
  styleUrls: ['./warehouse-contact-detail-information.component.less']
})
export class WarehouseContactDetailInformationComponent implements OnChanges {
  @ViewChild('history') history: WarehouseOrderHistoryComponent;
  @Input() contact: WarehouseContactModel;
  @Input() loading: boolean = false;
  @Output() noteAdmin = new EventEmitter();
  user: any = null;
  processedStaff: any = null;
  host: any = null;
  warehouse: WarehouseModel = null;

  rentArea: number = null;
  CONTACT_STATUS_COLOR = CONTACT_STATUS_COLOR;


  constructor(
    public adminService: AdminService,
    private warehouseService: WarehouseService) { }

  async ngOnChanges() {
    await this.loadData();
  }

  handleNoteAdmin() {
    this.noteAdmin.emit();
  }

  async loadData() {
    this.loading = true;
    if (this.contact) {
      if (this.contact.processedBy) {
        this.processedStaff = await this.adminService.getAdmin(this.contact.processedBy);
      }
      if (this.contact.warehouseId) {
        this.warehouse = await this.warehouseService.getWarehouse(this.contact.warehouseId);
      }
    }
    this.loading = false;
  }

  async loadHistory() {
    await this.history.loadData();
  }
}
