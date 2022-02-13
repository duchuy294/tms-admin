import * as moment from 'moment';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { LoyaltyPoint } from 'app/modules/marketing/models/loyalty-point.model';
import { LoyaltyPointQueryModel } from 'app/modules/marketing/models/loyalty-point-query.model';
import { LoyaltyPointService } from '@/modules/marketing/services/loyalty-point.service';
import { mapKeys } from 'lodash';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Type } from '@/constants/LoyaltyPoint';

@Component({
  selector: 'loyalty-point-management',
  templateUrl: './loyalty-point-management.component.html'
})
export class LoyaltyPointManagementComponent implements OnInit {
  @ViewChild('startDatePicker') startDatePicker: ElementRef;
  @ViewChild('endDatePicker') endDatePicker: ElementRef;
  visibleModal: boolean = false;
  visibleDetailModal: boolean = false;
  visibleFilter: boolean = false;
  loading: boolean = false;
  pageSize: number = 60;
  pageIndex: number = 1;
  query = new LoyaltyPointQueryModel();
  fromDate: any;
  toDate: any;
  selectedCode: string;
  userList = {};
  adminList = {};
  itemToShow: any = null;
  selectedTabIndex = 0;

  loyaltyPointData = new PagingModel<LoyaltyPoint>();

  userCode = {};
  type = [Type.order, Type.redeem, Type.adjustIncrease, Type.adjustDecrease];
  constructor(
    private service: LoyaltyPointService,
    private customerService: CustomerService,
    private servicerService: ServicerService,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadAllUserCode();
    this.query.limit = this.pageSize;
    this.loadData();
  }

  async loadAllUserCode() {
    let array = [];
    const responseCustomer = await this.customerService.getCustomers(new QueryModel({ limit: 5000, fields: '_id,code' }));
    array = [...array, ...responseCustomer.data];
    const responseServicer = await this.servicerService.getServicers(new QueryModel({ limit: 5000, fields: '_id,code' }));
    array = [...array, ...responseServicer.data];
    this.userCode = mapKeys(array, 'code');
  }

  async getReceiverName(data) {
    let userIds = '', servicerIds = '', accountIds = '';
    let countUserId = 0, countServicerId = 0, countCreatedBy = 0;
    data.forEach((element) => {
      if (element.userType === 'user') {
        if (countUserId !== 0) {
          userIds += ',';
        }
        userIds += element.userId;
        countUserId++;
      } else if (element.userType === 'servicer') {
        if (countServicerId !== 0) {
          servicerIds += ',';
        }
        servicerIds += element.userId;
        countServicerId++;
      }

      if (element.createdBy && element.createdBy !== undefined) {
        if (countCreatedBy !== 0) {
          accountIds += ',';
        }
        accountIds += element.createdBy;
        countCreatedBy++;
      }
    });
    let result = [];
    let responseCustomer, responseServicer, responseAdmin;
    if (userIds !== '') {
      responseCustomer = await this.customerService.getCustomers(new QueryModel({ limit: 5000, userIds, fields: '_id,fullName,code' }));
      result = [...result, ...responseCustomer.data];
    }
    if (servicerIds !== '') {
      responseServicer = await this.servicerService.getServicers(new QueryModel({ limit: 5000, servicerIds, fields: '_id,fullName,code' }));
      result = [...result, ...responseServicer.data];
    }
    if (accountIds !== '') {
      responseAdmin = await this.adminService.getAdmins(new QueryModel({ limit: 5000, accountIds, fields: '_id,fullName' }));
      this.adminList = mapKeys(responseAdmin.data, '_id');
    }
    return result;
  }

  async loadData() {
    this.loading = true;
    this.loyaltyPointData = await this.service.get(this.query);

    const response = await this.getReceiverName(this.loyaltyPointData.data);
    this.userList = mapKeys(response, '_id');

    this.loading = false;

  }

  onClickCreate() {
    this.handleVisibleModal(true);
  }

  toggleVisibleFilter() {
    this.visibleFilter = !this.visibleFilter;
  }

  handleVisibleModal(flag?: boolean | number | undefined) {
    this.visibleModal = !!flag;
  }

  handleVisibleDetailModal(flag?: boolean | number | undefined) {
    this.visibleDetailModal = !!flag;
  }

  onClickSearch() {
    this.loadData();
  }

  onClickClearFilter() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.selectedCode = null;
    this.query = new LoyaltyPointQueryModel({ limit: this.pageSize });
  }

  onChangeFromDate($event) {
    this.query.startTime = Number(moment($event).format('x'));
  }

  onChangeToDate($event) {
    this.query.endTime = Number(moment($event).format('x'));
  }

  onChangeSelectedCode() {
    this.query.userId = this.userCode[this.selectedCode] ? this.userCode[this.selectedCode]._id : this.selectedCode;
  }

  onClickShowDetail(data) {
    data = {
      ...data,
      receiverName: this.userList[data.userId].fullName,
      receiverCode: this.userList[data.userId].code,
      staffName: this.adminList[data.createdBy] ? this.adminList[data.createdBy].fullName : null,
    };
    this.itemToShow = data;
    this.handleVisibleDetailModal(true);
  }

  loadDataByPage($event = 1) {
    this.query.page = $event;
    this.loadData();
  }

  loadDataByPageSize($event = 20) {
    this.query.limit = $event;
    this.loadData();
  }

  onChangeLoyaltyPoint() {
    this.loadData();
  }

}
