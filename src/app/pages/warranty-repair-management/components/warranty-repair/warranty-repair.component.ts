import { BrandGridComponent } from './../../../../modules/warranty-repair/components/brand-grid/brand-grid.component';
import { BrandService } from './../../../../modules/warranty-repair/services/brand.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductTypeGridComponent } from './../../../../modules/warranty-repair/components/product-type-grid/product-type-grid.component';
import { ProductTypeService } from './../../../../modules/warranty-repair/services/product-type.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'warranty-repair',
  templateUrl: './warranty-repair.component.html'
})
export class WarrantyRepairComponent implements OnInit {
  constructor(
    private modalService: NzModalService,
    private brandService: BrandService,
    private productTypeService: ProductTypeService,
    private messageService: NzMessageService,
    private translateService: TranslateService
  ) { }

  @ViewChild('brandGrid')
  brandGrid: BrandGridComponent;
  @ViewChild('productTypeGrid')
  productTypeGrid: ProductTypeGridComponent;

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  confirmDeleteBrand(id: string) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteBrand(id),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }
  async deleteBrand(id: string = null) {
    if (id) {
      const response = await this.brandService.delete(id);
      if (response) {
        this.messageService.success(this.translateService.instant('common.sucessful-delete'));
        this.brandGrid.loadData();
      } else {
        this.translateService.instant('common.unsucessful-delete');
      }
    }
  }

  confirmDeleteProductType(id: string) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteProductType(id),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }
  async deleteProductType(id: string) {
    if (id) {
      const response = await this.productTypeService.delete(id);
      if (response) {
        this.messageService.success(this.translateService.instant('common.sucessful-delete'));
        this.productTypeGrid.loadData();
      } else {
        this.translateService.instant('common.unsucessful-delete');
      }
    }
  }
}