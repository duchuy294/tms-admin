import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'urlify'
})

export class UrlifyPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(value: string) {
        const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        value = value.replace(urlRegex, (url) => {
            return `<a target='_blank' href='${url}'>${url}</a>`;
        });
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}