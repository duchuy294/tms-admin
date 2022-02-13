import { AppTranslationModule } from './../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../modules/theme/nga.module';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { routing } from './pages.routing';
import { SettingModule } from '@/modules/system-setting/setting.module';

@NgModule({
    imports: [CommonModule, AppTranslationModule, NgaModule, routing, SettingModule],
    declarations: [PagesComponent]
})
export class PagesModule { }
