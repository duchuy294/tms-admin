import { CommonHelper } from '@/utility/common/common.helper';
import { Component, HostBinding, Input } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
    selector: '[ad-button]',
    preserveWhitespaces: false,
    styleUrls: ['./button.component.less'],
    template: `
        <i nz-icon nzType='loading' nzTheme='outline' *ngIf='nzLoading'></i>
        <span #contentElement><ng-content></ng-content></span>
    `
})
export class ButtonComponent extends NzButtonComponent {
    private colorMap = {
        blue: 'colorBlue',
        orange: 'colorOrange',
        green: 'colorGreen',
        cyan: 'colorCyan',
        yellow: 'colorYellow',
        magenta: 'colorMagenta',
        lime: 'colorLime',
        primary: 'colorPrimary',
        red: 'colorRed',
        gray: 'colorGray'
    };
    nzLoading = false;

    @HostBinding('class.ant-btn--color-blue') public colorBlue: boolean;
    @HostBinding('class.ant-btn--color-orange') public colorOrange: boolean;
    @HostBinding('class.ant-btn--color-green') public colorGreen: boolean;
    @HostBinding('class.ant-btn--color-cyan') public colorCyan: boolean;
    @HostBinding('class.ant-btn--color-yellow') public colorYellow: boolean;
    @HostBinding('class.ant-btn--color-magenta') public colorMagenta: boolean;
    @HostBinding('class.ant-btn--color-lime') public colorLime: boolean;
    @HostBinding('class.ant-btn--color-primary') public colorPrimary: boolean;
    @HostBinding('class.ant-btn--color-red') public colorRed: boolean;
    @HostBinding('class.ant-btn--color-gray') public colorGray: boolean;
    @HostBinding('class.ant-btn--uppercase') public upperCase: boolean;

    @Input()
    set nzColor(value: string) {
        if (this.colorMap[value]) {
            this[this.colorMap[value]] = true;
        }
    }

    @Input()
    set adLoading(value: boolean) {
        this.nzLoading = value;
    }

    @Input()
    set nzUpper(value: boolean) {
        this.upperCase = CommonHelper.toBoolean(value);
    }
}
