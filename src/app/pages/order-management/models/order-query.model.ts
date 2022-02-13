import * as _ from 'lodash';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { QueryModel } from 'app/models/query.model';

export class OrderQueryModel extends QueryModel {
    public finishedStart?: NgbDateStruct | Date | number;
    public finishedEnd?: NgbDateStruct | Date | number;
    public source?: string;
}