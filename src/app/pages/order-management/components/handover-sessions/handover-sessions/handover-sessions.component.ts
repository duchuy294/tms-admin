import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { HandoverSessionsListComponent } from '../handover-sessions-list/handover-sessions-list.component';

@Component({
  selector: 'handover-sessions',
  templateUrl: './handover-sessions.component.html',
  styleUrls: ['./handover-sessions.component.less']
})
export class HandoverSessionsComponent implements OnInit {
  
  @ViewChild(HandoverSessionsListComponent) partnerProcessList:HandoverSessionsListComponent;
  constructor(public servierService: ServicerService,) { }

  ngOnInit(): void {
  }

}
