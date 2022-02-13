import { AppTranslationModule } from '../app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { ModalContentComponent } from './components/modal-content.component';
import { ModalService } from './services/modal.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        NgbModalModule,
    ],
    declarations: [
        ModalContentComponent,
    ],
    providers: [
        ModalService,
    ],
    entryComponents: [
        ModalContentComponent,
    ]
})
export class AppModalModule { }
