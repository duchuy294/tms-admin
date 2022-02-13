import { ApiMarketingHttpService } from '../marketing/services/api-marketing-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { BannerGridComponent } from './components/banner-grid/banner-grid.component';
import { BannerListComponent } from './components/banner-list/banner-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateModifyBannerModalComponent } from './components/modals/create-modify-banner-modal/create-modify-banner-modal.component';
import { CreateModifyNewsCategoryComponent } from './components/modals/create-modify-news-category/create-modify-news-category.component';
import { CreateModifyNewsModalComponent } from './components/modals/create-modify-news-modal/create-modify-news-modal.component';
import { FAQService } from '../marketing/services/faq.service';
import { FilterNewsCategoryComponent } from './components/filter/filter-news-category/filter-news-category.component';
import { FilterNewsListComponent } from './components/filter/filter-news-list/filter-news-list.component';
import { FormsModule } from '@angular/forms';
import { MarketingNewsService } from './services/marketing-news.service';
import { NewsBannerService } from './services/news-banner.service';
import { NewsCategoryGridComponent } from './components/news-category-grid/news-category-grid.component';
import { NewsCategoryListComponent } from './components/news-category-list/news-category-list.component';
import { NewsCategoryService } from './services/news-category.service';
import { NewsGridComponent } from './components/news-grid/news-grid.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SendNewsNotificationModalComponent } from './components/modals/send-news-notification-modal/send-news-notification-modal.component';
import { TADService } from '../marketing/services/tad.service';
import { UtilityModule } from '@/utility/utility.module';


@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        RouterModule,
        UtilityModule,
    ],
    providers: [
        ApiMarketingHttpService,
        FAQService,
        MarketingNewsService,
        NewsBannerService,
        NewsCategoryService,
        TADService,
    ],
    declarations: [
        BannerGridComponent,
        BannerListComponent,
        CreateModifyBannerModalComponent,
        CreateModifyNewsCategoryComponent,
        CreateModifyNewsModalComponent,
        FilterNewsCategoryComponent,
        FilterNewsListComponent,
        NewsCategoryGridComponent,
        NewsCategoryListComponent,
        NewsGridComponent,
        NewsListComponent,
        SendNewsNotificationModalComponent,
    ],
    exports: [
        BannerListComponent,
        NewsCategoryListComponent,
        NewsListComponent,
    ],
    entryComponents: []
})
export class NewsModule { }
