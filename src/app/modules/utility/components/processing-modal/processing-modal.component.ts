import { Component, Input } from '@angular/core';

@Component({
    selector: 'processing-modal',
    templateUrl: './processing-modal.component.html',
    styleUrls: [
        './processing-modal.component.less'
    ]
})
export class ProcessingModalComponent {
    modelText: '';
    @Input() visible: boolean = false;
    @Input()
    set nzText(value) {
        this.modelText = value;
    }
}
