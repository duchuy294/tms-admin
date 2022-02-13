import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner-processing-modal',
  templateUrl: './spinner-processing-modal.component.html',
  styleUrls: ['./spinner-processing-modal.component.less']
})
export class SpinnerProcessingModalComponent {
  @Input() visible: boolean = false;

}
