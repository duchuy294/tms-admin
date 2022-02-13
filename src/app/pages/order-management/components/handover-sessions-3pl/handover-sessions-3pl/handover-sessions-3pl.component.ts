import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { HandoverSessionsList3PLComponent } from '../handover-sessions-list-3pl/handover-sessions-list-3pl.component';

@Component({
  selector: 'handover-sessions-3pl',
  templateUrl: './handover-sessions-3pl.component.html',
  styleUrls: ['./handover-sessions-3pl.component.less']
})
export class HandoverSessions3PLComponent implements OnInit {

  @ViewChild(HandoverSessionsList3PLComponent) handoverSessions3PL: HandoverSessionsList3PLComponent;
  constructor(public servierService: ServicerService, ) { }

  ngOnInit(): void { }

}
