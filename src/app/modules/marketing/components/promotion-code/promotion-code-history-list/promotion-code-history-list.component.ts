import { Component, ViewChild } from '@angular/core';
import { PromotionCodeHistoryGridComponent } from './../promotion-code-history-grid/promotion-code-history-grid.component';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'promotion-code-history-list',
  templateUrl: './promotion-code-history-list.component.html',
})
export class PromotionCodeHistoryListComponent {
  @ViewChild('grid') grid: PromotionCodeHistoryGridComponent;
  filterVisible: boolean = false;

  async search(query: QueryModel) {
    await this.grid.triggerLoadData(query);
  }

  toggleVisibleFilter() {
    this.filterVisible = !this.filterVisible;
  }
}
