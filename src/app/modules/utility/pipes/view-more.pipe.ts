import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewMore'
})
export class ViewMorePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string, height: number = 50, viewMore: string = 'View more', viewLess: string = 'View less'): any {
    const ranId = `viewmore-${Math.random()}`;
    return this.sanitizer.bypassSecurityTrustHtml(`
      <div id='${ranId}' style='height: ${height}px; overflow:hidden'>${value}      
      </div>
      <button id='button-${ranId}' 
        style='font-size: 12px; border-radius: 8px;'
        onClick='document.getElementById('${ranId}').hasAttribute('style')
          ? (document.getElementById('${ranId}').removeAttribute('style'),document.getElementById('button-${ranId}').innerText='${viewLess}')
          : (document.getElementById('${ranId}').setAttribute('style', 'overflow:hidden; height: ${height}px'),document.getElementById('button-${ranId}').innerText='${viewMore}')'>
        ${viewMore}
      </button>
     `);
  }
}
