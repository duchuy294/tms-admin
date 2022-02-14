import { BaMenuService } from '../../services';
import { GlobalState } from './../../../../global.state';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

@Component({
    selector: 'ba-menu',
    templateUrl: './baMenu.html'
})
export class BaMenuComponent implements OnInit, OnDestroy {
    @Input() sidebarCollapsed: boolean = false;
    @Input() menuHeight: number;
    @Output() expandMenu = new EventEmitter<any>();

    public menuItems: any[];
    protected _menuItemsSub: Subscription;
    public showHoverElem: boolean;
    public hoverElemHeight: number;
    public hoverElemTop: number;
    protected _onRouteChange: Subscription;
    public outOfArea: number = -200;
    public fullImagePath: string;

    constructor(
        private _router: Router,
        private _service: BaMenuService,
        private _state: GlobalState
    ) {}

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        this.fullImagePath = '../../assets/icon/'
        let iconName = []
        let count = 0
        
        newMenuItems.forEach(item => {
            if (item.icon) {
                iconName.push(item.icon.split('/').pop())
            }
        });
        for (let item of this.menuItems) {
            if (item.icon) {
                item.icon = this.fullImagePath + iconName[count]
                count++
             }
        }
        this.selectMenuAndNotify();
    }

    public selectMenuAndNotify(): void {
        if (this.menuItems) {
            this.menuItems = this._service.selectMenuItem(this.menuItems);
            this._state.notifyDataChanged(
                'menu.activeLink',
                this._service.getCurrentItem()
            );
        }
    }

    public ngOnInit(): void {
        this._onRouteChange = this._router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });

        this._menuItemsSub = this._service.menuItems.subscribe(
            this.updateMenu.bind(this)
        );
    }

    public ngOnDestroy(): void {
        this._onRouteChange.unsubscribe();
        this._menuItemsSub.unsubscribe();
    }

    public hoverItem($event): void {
        this.showHoverElem = true;
        this.hoverElemHeight = $event.currentTarget.clientHeight;
        this.hoverElemTop =
            $event.currentTarget.getBoundingClientRect().top - 50;
    }

    public toggleSubMenu($event): boolean {
        // const submenu = jQuery($event.currentTarget).next();
        if (this.sidebarCollapsed) {
            this.expandMenu.emit(null);
            if (!$event.item.expanded) {
                $event.item.expanded = true;
            }
        } else {
            this.menuItems.forEach(item => {
                if (item.title !== $event.item.title) {
                    item.expanded = false;
                }
            });
            $event.item.expanded = !$event.item.expanded;
            // submenu.slideToggle();
        }

        return false;
    }
}
