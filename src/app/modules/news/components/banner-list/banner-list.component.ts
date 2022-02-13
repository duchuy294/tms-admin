import { BannerGridComponent } from './../banner-grid/banner-grid.component';
import { Component, ViewChild } from '@angular/core';
import { NewsBannerModel } from '@/modules/news/models/news-banner.model';
import { NewsBannerService } from '@/modules/news/services/news-banner.service';

@Component({
  selector: 'banner-list',
  templateUrl: './banner-list.component.html',
})
export class BannerListComponent {
  addBannerModalVisible: boolean = false;
  bannerToEdit: NewsBannerModel = null;
  @ViewChild('bannerGrid') bannerGrid: BannerGridComponent;

  constructor(
    private newsBannerService: NewsBannerService,
  ) { }

  handleAddBannerModalVisible(flag = true) {
    this.addBannerModalVisible = !!flag;
  }

  addBanner() {
    this.bannerToEdit = null;
    this.handleAddBannerModalVisible();
  }

  async editBanner(bannerId) {
    const bannerInstance = await this.newsBannerService.get(bannerId);
    this.bannerToEdit = bannerInstance;
    this.handleAddBannerModalVisible();
  }

  handleAfterSubmit() {
    this.bannerGrid.loadData();
  }
}
