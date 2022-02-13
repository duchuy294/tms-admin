import * as _ from 'lodash';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { GroupServicer } from '../../../../../modules/servicer/models/group-servicer/group-servicer.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServicerService } from '../../../../../modules/servicer/services/servicer.service';
import { TeamService, TeamServicer } from '../../../../../modules/servicer/models/team-servicer/team-servicer.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'team-servicer-modify',
    templateUrl: 'team-servicer-modify.component.html'
})
export class TeamServicerModifyComponent implements OnChanges, OnInit {
    model = new TeamServicer();
    @Input() modifyingModel: TeamServicer = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    groups: GroupServicer[] = [];
    services: TeamService[] = [];
    isProcessing: boolean = false;

    constructor(private service: ServicerService,
        private messageService: NzMessageService,
        private translateService: TranslateService) { }

    async ngOnInit() {
        this.groups = (await this.service.getGroupServicers()).data;
    }

    ngOnChanges() {
        if (this.visible) {
            this.init();
        }
    }

    handleVisibleModel(flag: boolean = false) {
        this.handleVisible.emit(!!flag);
    }

    async updateService() {
        const self = this;
        const services = await this.service.getTeamServicerServices();
        const modelServices = self.model.services;
        _.forEach(services, x => {
            self.setSelectedValueForService(x);
            const modelService = _.find(modelServices, y => y._id === x._id);
            if (modelService) {
                _.merge(x, modelService);
            }
        });
        this.services = services;
    }

    init() {
        this.isProcessing = true;
        if (this.modifyingModel) {
            this.model = _.cloneDeep(this.modifyingModel);
        } else {
            this.model = new TeamServicer();
        }
        this.updateService();
        this.isProcessing = false;
    }

    getServiceValueName(service: ServiceModel, valueId: string) {
        if (!service.children) {
            return service._id === valueId ? service.name : '';
        }

        for (let index = 0; index < service.children.length; index++) {
            const item = service.children[index];
            const name = this.getServiceValueName(item, valueId);
            if (name !== '') {
                return name;
            }
        }

        return '';
    }

    addServiceValue(service: TeamService) {
        if (!service.selectedValues) {
            service.selectedValues = [];
        }
        if (!service.selectedValues.includes(service.selectedValue) && service.selectedValue) {
            service.selectedValues.push(service.selectedValue);
        }
        this.setSelectedValueForService(service);
    }

    removeServiceValue(service: TeamService, item: string) {
        _.remove(service.selectedValues, x => x === item);
        this.setSelectedValueForService(service);
    }

    setSelectedValueForService(service: TeamService) {
        if (service.values) {
            const remainingServices = _.filter(service.values, x => !service.selectedValues || !service.selectedValues.includes(x._id));
            service.selectedValue = remainingServices.length > 0 ? remainingServices[0]._id : null;
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.service.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.name)) {
            this.isProcessing = true;
            this.model.services = _.filter(this.services, x => x.isActive).map(x => _.omit(x, ['values', 'selectedValue']) as TeamService);
            let response = null;
            if (this.modifyingModel) {
                response = await this.service.updateTeamServicer(this.model);
            } else {
                response = await this.service.createTeamServicer(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
                this.handleVisibleModel(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
                this.messageService.warning(this.translateService.instant('common.invalid-data'));
            }
        } else {
            CommonHelper.validateForm(this.createModifyForm);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    cancel() {
        this.reset();
        this.handleVisibleModel(false);
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.createModifyForm);
    }
}