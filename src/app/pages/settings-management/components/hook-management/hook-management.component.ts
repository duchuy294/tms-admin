import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hook-management',
    templateUrl: './hook-management.component.html'
})

export class HookManagementComponent implements OnInit {
    ngOnInit() {
        window.scrollTo(0, 0);
    }
    selectedTabIndex = 0;
}