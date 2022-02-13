import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warehouse-setting',
  templateUrl: './warehouse-setting.component.html',
})
export class WarehouseSettingComponent implements OnInit {
  selectedTabIndex = 0;
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}