import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ba-menu-item',
    templateUrl: './baMenuItem.component.html',
    styleUrls: ['baMenuItem.component.less']
})
export class BaMenuItemComponent {
    @Input() menuItem: any;
    @Input() child: boolean = false;

    @Output() itemHover = new EventEmitter<any>();
    @Output() toggleSubMenu = new EventEmitter<any>();
    lang = this.translateService.currentLang;

    constructor(private readonly translateService: TranslateService) { }

    public onHoverItem($event): void {
        this.itemHover.emit($event);
    }

    public onToggleSubMenu($event, item): boolean {
        $event.item = item;
        this.toggleSubMenu.emit($event);
        return false;
    }
}
