import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { IIncident } from './../../../../../../modules/order/models/point-incident.model';
import { INCIDENT_STATUS_COLOR } from './../../../../../../constants/IncidentStatus';
@Component({
  selector: 'point-incident',
  templateUrl: './point-incident.component.html',
  styleUrls: ['./point-incident.component.less']
})
export class PointIncidentComponent implements OnInit {
  @Input() model: IIncident[] = [];
  @Input() processIncident: any = null;
  incidentImages: { [_id: string]: any } = {};
  processedIncidents: { [_id: string]: any } = {};
  processedincidentImages: { [_id: string]: any } = {};
  customerSign: { [_id: string]: any } = {};
  flagExtend: boolean = false;
  INCIDENT_STATUS_COLOR = INCIDENT_STATUS_COLOR;

  ngOnInit() {
    this.model.reverse();
    this.incidentImages = {};
    this.customerSign = [];
    for (let i = 0; i < this.model.length; ++i) {
      this.incidentImages[i] = [];
      this.model[i].images.forEach(image => {
        this.incidentImages[i].push({
          url: image,
          status: 'done'
        });
      });
    }
    if (this.processIncident) {
      this.processIncident.forEach(item => {
        this.processedincidentImages[item.id] = [];
        item.images.forEach(image => {
          this.processedincidentImages[item.id].push({
            url: image,
            status: 'done'
          });
        });
        if (item.signImage) {
          this.customerSign[item.id] = [];
          this.customerSign[item.id].push({
            url: item.signImage,
            status: 'done'
          });
        }
      });
    }
    this.processedIncidents = _.mapKeys(this.processIncident, 'id');
  }

  handleVisibleDetail(flag: boolean = true) {
    this.flagExtend = !flag;
  }
}
