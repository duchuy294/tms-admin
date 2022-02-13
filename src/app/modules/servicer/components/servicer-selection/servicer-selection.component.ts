import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { IStringSelection } from './../../../../modules/utility/models/filter.model';
import { ModalService } from './../../../../modules/modal/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryModel } from '../../../../models/query.model';
import { Selection } from '../../../../modules/utility/models/filter.model';
import { Servicer } from '../../../servicer/models/servicer/servicer.model';
import { ServicerService } from '../../../../modules/servicer/services/servicer.service';
import { UserStatus } from '../../../../constants/UserStatus';

@Component({
    selector: 'servicer-selection',
    templateUrl: './servicer-selection.component.html',
    styleUrls: ['./servicer-selection.component.less']
})
export class ServicerSelectionComponent implements OnInit {
    select: (servicers: Servicer[]) => boolean;
    public multiple = true;
    public model = new QueryModel({ status: UserStatus.ACTIVE });
    public teamQueryModel = new QueryModel({ limit: 1000 });
    isCheckAll: boolean;
    groups: Selection[] = [];
    teams: Selection[] = [];
    servicers: Servicer[] = [];
    locations: any[];
    sorts: IStringSelection[] = [];

    constructor(
        private modalService: ModalService,
        public activeModal: NgbActiveModal,
        public servicerService: ServicerService
    ) { }

    async ngOnInit() {
        await this.getData();
        await this.initGroups();
        await this.initTeams();
    }

    private async initGroups() {
        this.groups = (
            await this.servicerService.getGroupServicers(
                new QueryModel({ limit: 1000 })
            )
        ).data;
    }

    async initTeams() {
        this.teams = (
            await this.servicerService.getTeamServicers(this.teamQueryModel)
        ).data;
    }

    async selectGroup() {
        this.model.teamId = '';
        await this.initTeams();
        await this.getData(500);
    }

    async filter() {
        await this.getData(500);
    }

    async getData(limit: number = 20) {
        this.model.limit = limit;
        const response = await this.servicerService.filter(this.model);
        this.servicers = _.map(response.data, item => new Servicer(item));
    }

    checkAll() {
        this.servicers.forEach(element => {
            element.selected = this.isCheckAll;
        });
    }

    async confirm() {
        const selectedServicers = _.filter(this.servicers, x => x.selected);
        if (selectedServicers.length === 0) {
            this.modalService.warning('Chọn người thực hiện!');
        } else {
            if (this.select) {
                const result = await this.select(selectedServicers);
                if (result) {
                    this.activeModal.close();
                }
            } else {
                this.activeModal.close();
            }
        }
    }
}
