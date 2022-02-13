import { Component, Input } from '@angular/core';

@Component({
    selector: 'statistic-tile',
    templateUrl: './statistic-tile.component.html',
    styleUrls: ['./statistic-tile.component.less']
})
export class StatisticTileComponent {
    @Input() data = [];
    @Input() style = {};
}