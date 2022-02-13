import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sms-management',
    templateUrl: './sms-management.component.html'
})
export class SmsManagementComponent implements OnInit {
    selectedTabIndex = 0;

    ngOnInit() {
        window.scrollTo(0, 0);
    }
}