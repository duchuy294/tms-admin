import { Component, Input } from '@angular/core';
import { DashboardSummaryModel } from 'app/pages/dashboard/models/dashboard-summary.model';

@Component({
    selector: 'dashboard-summary',
    templateUrl: 'dashboard-summary.component.html',
    styleUrls: ['./dashboard-summary.component.less']
})
export class DashboardSummaryComponent {
    @Input() model = new DashboardSummaryModel();
}
