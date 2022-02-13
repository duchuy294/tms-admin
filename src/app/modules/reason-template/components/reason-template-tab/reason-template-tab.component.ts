import { Component } from '@angular/core';
import { ReasonTemplate } from '../../const/reason-template.const';

@Component({
    selector: 'reason-template-tab',
    templateUrl: './reason-template-tab.component.html',
    styleUrls: ['./reason-template-tab.component.less']
})

export class ReasonTemplateTabComponent {
    types = ReasonTemplate.types;
}