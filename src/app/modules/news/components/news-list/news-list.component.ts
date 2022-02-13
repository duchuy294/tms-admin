import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketingNewsService } from '@/modules/news/services/marketing-news.service';
import { NewsGridComponent } from './../news-grid/news-grid.component';
import { NewsModel } from '@/modules/news/models/news.model';
import { QueryModel } from '../../../../models/query.model';

@Component({
  selector: 'news-list',
  templateUrl: './news-list.component.html',
})
export class NewsListComponent implements OnInit {
  addNewsModalVisible: boolean = false;
  sendNewsNotiModalVisible: boolean = false;
  newsToEdit: NewsModel = null;
  @ViewChild('newsGrid') newsGrid: NewsGridComponent;

  constructor(
    private marketingNewsService: MarketingNewsService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  handleAddNewsModalVisible(flag = true) {
    this.addNewsModalVisible = !!flag;
  }

  handleSendNewsNotiModalVisible(flag = true) {
    this.sendNewsNotiModalVisible = !!flag;
  }

  addNews() {
    this.newsToEdit = null;
    this.handleAddNewsModalVisible();
  }

  async editNews(newsId) {
    const newsInstance = await this.marketingNewsService.get(newsId);
    this.newsToEdit = newsInstance;
    this.handleAddNewsModalVisible();
  }

  async sendNoti(newsId) {
    const newsInstance = await this.marketingNewsService.get(newsId);
    this.newsToEdit = newsInstance;
    this.handleSendNewsNotiModalVisible();
  }

  handleAfterSubmit() {
    this.newsGrid.loadData();
  }

  async handleSearch(queryModel: QueryModel) {
    await this.newsGrid.triggerLoadData(queryModel, 1);
  }

  async handleReset(queryModel: QueryModel) {
    await this.newsGrid.triggerLoadData(queryModel, 1);
  }
}
