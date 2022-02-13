import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild
  } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'ba-back-top',
  styleUrls: ['./baBackTop.scss'],
  template: `
    <i #baBackTop class='material-icons ba-back-top' title='Back to Top'>
      keyboard_arrow_up
    </i>
  `
})
export class BaBackTopComponent implements AfterViewInit {
  @Input() position: number = 400;
  @Input() showSpeed: number = 500;
  @Input() moveSpeed: number = 1000;

  @ViewChild('baBackTop') _selector: ElementRef;

  ngAfterViewInit() {
    this._onWindowScroll();
  }

  @HostListener('click')
  _onClick(): boolean {
    jQuery('html, body').animate({ scrollTop: 0 }, { duration: this.moveSpeed });
    return false;
  }

  @HostListener('window:scroll')
  _onWindowScroll(): void {
    const el = this._selector.nativeElement;
    window.scrollY > this.position ? jQuery(el).fadeIn(this.showSpeed) : jQuery(el).fadeOut(this.showSpeed);
  }
}
