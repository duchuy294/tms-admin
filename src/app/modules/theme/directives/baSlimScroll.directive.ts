import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
declare var jQuery: any;

@Directive({
  selector: '[baSlimScroll]'
})
export class BaSlimScrollDirective implements OnChanges {
  @Input() public baSlimScrollOptions: Object;

  constructor(private _elementRef: ElementRef) { }

  ngOnChanges() {
    jQuery(this._elementRef.nativeElement).slimScroll({ destroy: true });
    jQuery(this._elementRef.nativeElement).slimScroll(this.baSlimScrollOptions);
  }
}
