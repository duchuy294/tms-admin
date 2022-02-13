import { AccountModel } from '@/modules/admin/models/admin.model';
import { Component, Input } from '@angular/core';
import { GridAction } from '../../../../../models/grid-action.model';
import { RewardModel } from 'app/modules/marketing/models/reward.model';

@Component({
    selector: 'reward-grid',
    templateUrl: 'reward-grid.component.html'
})
export class RewardGridComponent {
    @Input() rewards: RewardModel[] = [];
    @Input() actions: GridAction[] = [];
    @Input() loading = false;
    @Input() adminUpdatedBy: { [_id: string]: AccountModel } = {};
}
