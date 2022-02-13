import { ActivityService } from '../activity/services/activity.service';
import { ApiActivityHttpService } from '../activity/services/api-activity-http.service';
import { AppTranslationModule } from './../app-translation/app-translation.module';
import { BaBackTopComponent, BaMenuComponent, BaMenuItemComponent, BaPageTopComponent, BaSidebarComponent } from './components';
import { BaImageLoaderService, BaMenuService, BaThemePreloader, BaThemeSpinner } from './services';
import { BaScrollPositionDirective, BaSlimScrollDirective, BaThemeRunDirective } from './directives';
import { BaThemeConfigProvider } from './theme.configProvider';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';

const NGA_COMPONENTS = [
    BaBackTopComponent,
    BaMenuItemComponent,
    BaMenuComponent,
    BaPageTopComponent,
    BaSidebarComponent
];

const NGA_DIRECTIVES = [
    BaScrollPositionDirective,
    BaSlimScrollDirective,
    BaThemeRunDirective
];

const NGA_SERVICES = [
    BaImageLoaderService,
    BaThemePreloader,
    BaThemeSpinner,
    BaMenuService
];

@NgModule({
    declarations: [
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AppTranslationModule,
        UtilityModule,
        InfiniteScrollModule,
        NzBadgeModule,
        NzPopoverModule,
        NzAvatarModule,
    ],
    exports: [
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS
    ],
    providers: [ApiActivityHttpService, ActivityService]
})
export class NgaModule {
    static forRoot(): ModuleWithProviders<NgaModule> {
        return {
            ngModule: NgaModule,
            providers: [
                BaThemeConfigProvider,
                ...NGA_SERVICES
            ],
        };
    }
}
