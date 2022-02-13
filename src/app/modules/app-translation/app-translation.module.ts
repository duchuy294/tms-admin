import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/US/', `.json?v=${Date.now()}`);
}

const translationOptions = {
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
};

@NgModule({
    imports: [TranslateModule.forRoot(translationOptions)],
    exports: [TranslateModule],
    providers: [TranslateService]
})
export class AppTranslationModule {
    constructor(private translate: TranslateService) {
        this.translate.addLangs(['vi', 'en']);
        this.translate.setDefaultLang('vi');
        this.translate.use(localStorage.getItem('language') || 'vi');
    }
}
