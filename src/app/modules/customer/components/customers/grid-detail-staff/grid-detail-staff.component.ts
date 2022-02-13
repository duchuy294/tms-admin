import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { UserType } from '@/constants/UserType';

@Component({
  selector: 'grid-detail-staff',
  templateUrl: './grid-detail-staff.component.html'
})
export class GridDetailStaffComponent implements OnInit {

  modelQuery = new QueryModel();
  public tableData = new PagingModel<Customer>();
  loading: boolean = false;

  constructor(
    private customerService: CustomerService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  @Input()
  set giveEnterpriseId(value) {
    this.modelQuery.enterpriseId = value;
  }

  async loadData() {
    this.loading = true;
    this.modelQuery.type = UserType.STAFF;
    this.tableData = await this.customerService.getCustomers(this.modelQuery);
    const verifyQuery = this.customerService.verifyPageQueryModel(this.tableData, this.modelQuery);
    if (verifyQuery.error) {
      this.modelQuery = verifyQuery.modelQuery;
      this.customerService = await this.customerService.getCustomersAndStaistic(this.modelQuery);
    }
    this.loading = false;
  }

  async loadDataByPage(event = 1) {
    this.modelQuery.page = event;
    await this.loadData();
  }

  async loadDataByPageSize(event = 20) {
    this.modelQuery.limit = event;
    await this.loadData();
  }
}