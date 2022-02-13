import * as _ from 'lodash';
import { AddressComponent } from './../../../../../modules/location/components/address/address.component';
import { BankService } from '@/modules/finance/services/bank.service';
import { CommonHelper } from '@/modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FilterService } from '@/modules/utility/services/filter.service';
import { FormType } from '@/modules/utility/models/form-type';
import { MultiLanguageString } from './../../../../../models/multi-language/multi-string';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/modules/utility/models/filter.model';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerModel } from 'app/modules/report/models/servicer-model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { ServicerType } from 'app/constants/ServicerType';
import { Status } from 'app/constants/status.enum';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { UserLevelModel } from 'app/modules/user/models/user-level.model';
import { UserLevelService } from 'app/modules/user/services/user-level.service';
import { UserStatus } from '@/constants/UserStatus';
import { Vehicle } from '@/models/vehicle.model';
import { VehicleService } from '@/modules/delivery/services/vehicle.service';
import { VehicleType } from '@/models/vehicle-type.model';

@Component({
    selector: 'servicer-modify',
    templateUrl: 'servicer-modify.component.html',
    styleUrls: ['servicer-modify.component.less']
})
export class ServicerModifyComponent implements OnInit, OnChanges {
    visibleModal: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() update = new EventEmitter();
    @ViewChild('servicerForm') servicerForm: NgForm;
    @ViewChild('address') address: AddressComponent;
    formType: FormType = FormType.Create;
    modelQuery = new Servicer({ status: UserStatus.NEW });
    current: Servicer;
    success: () => void;

    error = new Servicer();
    vehicle: VehicleType[] = [];
    groups: Selection[] = [];
    selectedTeam: TeamServicer;
    teams: TeamServicer[] = [];
    servicerTypes = [
        ServicerType.Personal,
        ServicerType.Enterprise,
        ServicerType.EnterpriseStaff,
        ServicerType.Operator,
        ServicerType.truckHub
    ];
    enterprises: Servicer[] = [];
    enterPrisesQuery: any;
    enterpriseTeams: TeamServicer[] = [];
    enterpriseVehicles: Vehicle[];
    enterpriseVehiclesQuery: any;
    vehiclesEnterPriseStaff: any;
    vehicleStaff: string;
    selectedIndex: number = 0;
    rerenderAddress: boolean = true;
    servicerQuery = new QueryModel({
        status: Status.ACTIVE,
        fields: 'code,fullName',
        limit: 10
    });
    images = [];
    identityCardImages = [];
    businessCertificateImages = [];
    driverLicenseImages = [];
    vehicleName: { [_id: string]: MultiLanguageString } = {};
    vehicles: any;
    referrals: ServicerModel[] = [];
    vehicleActive: string;
    vehicleStatuses: { [_id: string]: boolean } = {};
    vehicleParentName: { [_id: string]: MultiLanguageString } = {};
    capacityVehicles: { [_id: string]: MultiLanguageString } = {};
    loadingStatusActive: Boolean = false;
    banks: string[] = [];
    listUserLevel: UserLevelModel[] = [];
    statuses: UserStatus[] = [
        UserStatus.NEW,
        UserStatus.ACTIVE,
        UserStatus.SUSPENDED,
        UserStatus.DELETED
    ];
    lang = 'vi';

    @Input()
    set model(value) {
        this.modelQuery = value;
        this.loadDataEdit();
    }
    get model() {
        return this.modelQuery;
    }

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }
    get isPersonalServicer() {
        return this.model.type === ServicerType.Personal;
    }

    get isEnterpriseServicer() {
        return this.model.type === ServicerType.Enterprise;
    }

    get isEnterpriseStaffServicer() {
        return this.model.type === ServicerType.EnterpriseStaff;
    }

    constructor(
        private service: ServicerService,
        private filterService: FilterService,
        private vehicleService: VehicleService,
        private messageService: NzMessageService,
        private bankService: BankService,
        private userLevelService: UserLevelService
    ) { }

    async ngOnChanges(changes) {
        if (changes && changes.visible.currentValue) {
            await this.initGroups();
            await this.initTeams();
            await this.loadEnterPrises();
        }
    }

    async searchServicer(data: string = '') {
        if (data.length === 8) {
            _.assignIn(this.servicerQuery, {
                name: null,
                code: data
            });
        } else {
            _.assignIn(this.servicerQuery, {
                name: data,
                code: null
            });
        }
        this.referrals = (await this.service.filter(this.servicerQuery)).data;
    }

    async loadDataEdit() {
        if (this.model.images.length) {
            this.model.images.forEach(image => {
                this.images = [
                    ...this.images,
                    {
                        uid: _.uniqueId('i'),
                        status: 'done',
                        url: image
                    }
                ];
            });
        }
        if (this.model.identityCardImages.length) {
            this.model.identityCardImages.forEach(image => {
                this.identityCardImages = [
                    ...this.identityCardImages,
                    {
                        uid: _.uniqueId('im'),
                        status: 'done',
                        url: image
                    }
                ];
            });
        }
        if (this.model.driverLicenseImages.length) {
            this.model.driverLicenseImages.forEach(image => {
                this.driverLicenseImages = [
                    ...this.driverLicenseImages,
                    {
                        uid: _.uniqueId('dli'),
                        status: 'done',
                        url: image
                    }
                ];
            });
        }

        if (this.model.vehicles && this.model.vehicles.length) {
            if (this.model.type === ServicerType.EnterpriseStaff) {
                this.loadingStatusActive = true;
                this.model.vehicles.forEach(vehicleItem => {
                    this.vehiclesEnterPriseStaff = {
                        ...this.vehiclesEnterPriseStaff,
                        [vehicleItem._id]: {
                            ...vehicleItem
                        }
                    };
                    if (this.model.vehicle) {
                        this.vehicleStatuses[vehicleItem._id] =
                            vehicleItem._id === this.model.vehicle._id;
                    } else {
                        this.vehicleStatuses[vehicleItem._id] = false;
                    }
                });
                this.loadingStatusActive = false;
            } else {
                let uniqueIdVehicle = null;
                this.model.vehicles.forEach(vehicleItem => {
                    uniqueIdVehicle = _.uniqueId('vehicle');
                    this.vehicles = {
                        ...this.vehicles,
                        [uniqueIdVehicle]: {
                            ...vehicleItem
                        }
                    };
                    if (
                        this.model.vehicle &&
                        vehicleItem._id === this.model.vehicle._id
                    ) {
                        this.vehicleActive = uniqueIdVehicle;
                    }
                });
            }
        }
        const vehicle = await this.vehicleService.getVehicleTypes();
        await this.initGroups();
        await this.initTeams();
        await this.loadEnterPrises();
        this.vehicle = vehicle;
        this.loadUserLevels();
    }

    async ngOnInit() {
        const vehicle = await this.vehicleService.getVehicleTypes();
        await this.initGroups();
        await this.initTeams();
        await this.loadEnterPrises();
        await this.searchServicer();
        await this.loadUserLevels();
        await this.getBanks();
        this.vehicle = vehicle;
        await this.loadNameTypeVehicle();
    }

    async loadStaffLevel(enterprise: Servicer = null) {
        if (enterprise.hasOwnProperty('serveLevelIds')) {
            const userLevelIdsString = _.map(
                enterprise.serveLevelIds,
                link => link
            ).join(',');
            if (!userLevelIdsString) {
                this.listUserLevel = [];
            } else {
                const query = new QueryModel({
                    limit: 1000,
                    status: `${Status.ACTIVE}`,
                    userLevelIds: `${userLevelIdsString}`
                });
                const userLevels = await this.userLevelService.getUserLevels(
                    query
                );
                if (!_.isEmpty(userLevels.data)) {
                    this.listUserLevel = userLevels.data;
                } else {
                    this.listUserLevel = [];
                }
            }
        } else {
            this.listUserLevel = [];
        }
    }

    async loadEnterPrises() {
        const result = await this.service.filter(
            new QueryModel({ type: ServicerType.Enterprise, limit: 1000 })
        );
        this.enterprises = result.data;

        if (this.enterprises.length > 0) {
            this.enterPrisesQuery = _.mapKeys(this.enterprises, '_id');
            if (this.model.enterpriseId) {
                const enterprise = this.enterprises.find(
                    x => x._id === this.model.enterpriseId
                );

                this.enterpriseTeams = enterprise ? enterprise.teams : [];
                this.enterpriseVehicles = enterprise ? enterprise.vehicles : [];
                if (this.isEnterpriseStaffServicer) {
                    await this.loadStaffLevel(enterprise);
                }
            } else {
                this.model.enterpriseId = this.enterprises[0]._id;
                this.enterpriseTeams = this.enterprises[0]
                    ? this.enterprises[0].teams
                    : [];
                this.enterpriseVehicles = this.enterprises[0]
                    ? this.enterprises[0].vehicles
                    : [];
                if (this.isEnterpriseStaffServicer) {
                    await this.loadStaffLevel(this.enterprises[0]);
                }
            }
            this.enterpriseVehiclesQuery = _.mapKeys(
                this.enterpriseVehicles,
                '_id'
            );
            if (this.isEnterpriseStaffServicer) {
                this.loadNameVehicleAndCapacity();
                if (
                    !_.isEmpty(this.vehiclesEnterPriseStaff) &&
                    !_.isEmpty(this.enterpriseVehicles)
                ) {
                    this.vehiclesEnterPriseStaff = _.filter(
                        this.vehiclesEnterPriseStaff,
                        itemStaffVehicles =>
                            _.findIndex(
                                this.enterpriseVehicles,
                                itemEnterpriseVehicles =>
                                    itemStaffVehicles._id ===
                                    itemEnterpriseVehicles._id
                            ) > -1
                    );
                    this.vehiclesEnterPriseStaff = _.mapKeys(
                        this.vehiclesEnterPriseStaff,
                        '_id'
                    );
                }
            }
        }
    }

    async changeType(type: number = null) {
        if (type === ServicerType.Enterprise || type === ServicerType.Personal) {
            await this.loadUserLevels();
        } else {
            this.model.serveLevelIds = [];
            this.vehiclesEnterPriseStaff = {};
            this.vehicleStatuses = {};
            if (this.model.enterpriseId) {
                const enterprise = this.enterprises.find(
                    x => x._id === this.model.enterpriseId
                );
                if (enterprise) {
                    this.model.groupId = enterprise.groupId;
                    if (this.isEnterpriseStaffServicer) {
                        await this.loadStaffLevel(enterprise);
                        this.loadNameTypeVehicle();
                    }
                }
            }
        }
    }

    handleVisibleModal(flag = false) {
        this.visible = !!flag;
        this.visibleChange.emit(!!flag);
        if (!this.visible) {
            this.reset();
        }
    }

    async initTeams() {
        this.teams = await this.filterService.getTeams();
        this.selectedTeam = null;
    }

    async updateGroup() {
        if (this.model.type === ServicerType.EnterpriseStaff) {
            if (this.enterPrisesQuery[this.model.enterpriseId]) {
                this.enterpriseTeams = this.enterPrisesQuery[
                    this.model.enterpriseId
                ];
            }
        }
    }

    addTeam() {
        if (!this.selectedTeam) {
            this.messageService.warning('Vui lòng chọn đội dịch vụ cần thêm');
            return;
        }
        if (!_.find(this.model.teams, y => y._id === this.selectedTeam._id)) {
            this.model.teams.push(
                _.pick(this.selectedTeam, ['_id', 'name']) as TeamServicer
            );
        }
        this.selectedTeam = null;
    }

    addAllTeams() {
        const teams = this.model.type === 3 ? this.enterpriseTeams : this.teams;
        this.model.teams = _.map(
            teams,
            x => _.pick(x, ['_id', 'name']) as TeamServicer
        );
    }

    removeTeam(team: TeamServicer) {
        _.remove(this.model.teams, x => team === x);
    }

    reset() {
        this.vehicles = {};
        this.vehiclesEnterPriseStaff = {};
        this.vehicleStatuses = {};
        this.images = [];
        this.identityCardImages = [];
        this.businessCertificateImages = [];
        this.driverLicenseImages = [];
        this.vehicles = {};
        this.enterPrisesQuery = {};
        this.address.reset();
        this.selectedIndex = 0;
        this.model = new Servicer();
        CommonHelper.resetForm(this.servicerForm);
    }

    changeImages($event, imageType = 'images') {
        if (this.model[imageType]) {
            this.model[imageType] = $event;
        }
    }

    addVehicle() {
        this.vehicles = {
            ...this.vehicles,
            [_.uniqueId('vehicle')]: {}
        };
        if (Object.keys(this.vehicles).length === 1) {
            this.vehicleActive = Object.keys(this.vehicles)[0];
        }
    }

    activeVehicle(vehicleId: string = null) {
        this.vehicleActive = vehicleId;
    }

    removeVehicle(vehicleId: string = null) {
        if (this.vehicles && this.vehicles[vehicleId]) {
            delete this.vehicles[vehicleId];
            this.vehicles = { ...this.vehicles };
            if (this.vehicleActive && this.vehicleActive === vehicleId) {
                this.vehicleActive = '';
            }
        }
    }

    async confirm() {
        if (this.servicerForm.valid) {
            if (!this.model.images.length) {
                this.messageService.warning('Vui lòng chọn ảnh đại diện');
                this.selectedIndex = 0;
                return;
            }
            if (!this.model.teams.length) {
                this.messageService.warning('Vui lòng chọn đội dịch vụ');
                this.selectedIndex = 2;
                return;
            }

            if (this.isPersonalServicer) {
                if (this.vehicleActive && this.vehicles[this.vehicleActive]) {
                    this.model.vehicle = _.cloneDeep(
                        this.vehicles[this.vehicleActive]
                    );
                    this.vehicles[this.vehicleActive].status = true;
                } else {
                    if (this.model.vehicle) {
                        _.forEach(this.vehicles, item => {
                            if (
                                item._id &&
                                item._id === this.model.vehicle._id
                            ) {
                                this.model.vehicle[
                                    'deactiveUsedVehicle'
                                ] = true;
                            }
                        });
                    }
                }
            }

            if (this.isEnterpriseStaffServicer) {
                if (
                    !_.isEmpty(this.vehicleStatuses) &&
                    this.isEnterpriseStaffServicer
                ) {
                    for (const key in this.vehicleStatuses) {
                        if (
                            this.vehicleStatuses.hasOwnProperty(key) &&
                            this.vehicleStatuses[key] &&
                            this.vehiclesEnterPriseStaff[key]
                        ) {
                            this.model.vehicle = _.cloneDeep(
                                this.vehiclesEnterPriseStaff[key]
                            );
                            this.vehiclesEnterPriseStaff[key].status = true;
                            break;
                        } else {
                            if (
                                this.vehiclesEnterPriseStaff[key] &&
                                this.vehiclesEnterPriseStaff[key]._id &&
                                this.vehiclesEnterPriseStaff[key]._id ===
                                this.model.vehicle._id
                            ) {
                                this.model.vehicle[
                                    'deactiveUsedVehicle'
                                ] = true;
                            }
                        }
                    }
                }
            }
            this.model.vehicles = [];
            if (!this.isEnterpriseStaffServicer && _.size(this.vehicles)) {
                _.forEach(this.vehicles, vehicle => {
                    this.model.vehicles.push(vehicle);
                });
            } else if (
                this.isEnterpriseStaffServicer &&
                _.size(this.vehiclesEnterPriseStaff)
            ) {
                _.forEach(this.vehiclesEnterPriseStaff, vehicle => {
                    this.model.vehicles.push(vehicle);
                });
            }

            const modelUpdate = _.cloneDeep(this.model);
            if (modelUpdate.vehicle && modelUpdate.vehicle.vehicleChildrenType) {
                delete modelUpdate.vehicle.vehicleChildrenType;
            }
            if (
                this.model.vehicle &&
                this.model.vehicle['deactiveUsedVehicle']
            ) {
                delete this.model.vehicle['deactiveUsedVehicle'];
            }
            if (modelUpdate.vehicles && !_.isEmpty(modelUpdate.vehicles)) {
                _.forEach(modelUpdate.vehicles, item => {
                    delete item['vehicleChildrenType'];
                });
            }

            const result = this.model._id
                ? await this.service.updateServicer(modelUpdate)
                : await this.service.createServicer(modelUpdate);

            this.handleResult(result);
        } else {
            this.messageService.warning(
                'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại'
            );
            this.selectedIndex = 0;
            this.rerenderAddress = !this.rerenderAddress;
            CommonHelper.validateForm(this.servicerForm);
        }
    }

    close() {
        this.handleVisibleModal();
    }

    private async initGroups() {
        const result = await this.service.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.groups = result.data;
        if (!this.model._id) {
            // this.model.groupId = this.groups[0]._id;
        }
    }

    private handleResult(result) {
        if (result.errorCode === 0) {
            this.messageService.success(
                `${this.model._id ? 'Cập nhật' : 'Thêm'} đối tác thành công`
            );
            this.close();
            if (this.success) {
                this.success();
            }
            this.update.emit();
        } else {
            this.messageService.error(result.message);
        }
    }

    addVehicleEnterpriseStaff(type = 'single', checkActive: Boolean = false) {
        if (type === 'single') {
            if (!this.vehicleStaff) {
                this.messageService.warning('Vui lòng chọn xe muốn thêm');
                return;
            }
            this.vehiclesEnterPriseStaff = {
                ...this.vehiclesEnterPriseStaff,
                [this.vehicleStaff]: {
                    ...this.enterpriseVehiclesQuery[this.vehicleStaff]
                }
            };
            if (
                this.vehiclesEnterPriseStaff &&
                Object.keys(this.vehiclesEnterPriseStaff).length === 1
            ) {
                this.vehicleStatuses[this.vehicleStaff] = true;
            } else {
                this.vehicleStatuses[this.vehicleStaff] = false;
            }
            this.vehicleStaff = null;
        } else {
            this.enterpriseVehicles.forEach(vehicle => {
                this.vehiclesEnterPriseStaff = {
                    ...this.vehiclesEnterPriseStaff,
                    [vehicle._id]: {
                        ...vehicle
                    }
                };
            });
            if (!_.isEmpty(this.vehicleStatuses)) {
                for (const key in this.vehicleStatuses) {
                    if (
                        this.vehicleStatuses.hasOwnProperty(key) &&
                        this.vehicleStatuses[key]
                    ) {
                        checkActive = true;
                        break;
                    }
                }
            }

            if (!checkActive && !_.isEmpty(this.enterpriseVehicles)) {
                this.vehicleStatuses[this.enterpriseVehicles[0]._id] = true;
            }
        }
    }

    removeStaffVehicle(vehicleId: string = null) {
        if (this.vehiclesEnterPriseStaff[vehicleId]) {
            delete this.vehiclesEnterPriseStaff[vehicleId];
            delete this.vehicleStatuses[vehicleId];
            this.vehiclesEnterPriseStaff = {
                ...this.vehiclesEnterPriseStaff
            };
        }
    }

    onActiveStaffVehicle(vehicleId: string = null) {
        this.loadingStatusActive = true;
        if (this.vehicleStatuses[vehicleId]) {
            this.vehicleStatuses[vehicleId] = false;
        } else {
            for (const key in this.vehiclesEnterPriseStaff) {
                if (this.vehicleStatuses[key]) {
                    this.vehicleStatuses[key] = false;
                }
            }
            this.vehicleStatuses[vehicleId] = true;
        }
        this.loadingStatusActive = false;
    }

    async updateEnterprise() {
        if (this.model.enterpriseId) {
            const enterprise = this.enterprises.find(
                x => x._id === this.model.enterpriseId
            );
            this.enterpriseTeams = enterprise ? enterprise.teams : [];
            this.enterpriseVehicles = enterprise ? enterprise.vehicles : [];
            this.enterpriseVehiclesQuery = _.mapKeys(
                this.enterpriseVehicles,
                '_id'
            );
            this.model.teams = [];
            this.selectedTeam = null;
            this.model.groupId = enterprise.groupId;
            this.selectedTeam = this.enterpriseTeams.length
                ? this.enterpriseTeams[0]
                : null;
            if (this.isEnterpriseStaffServicer) {
                this.loadNameVehicleAndCapacity();
                await this.loadStaffLevel(enterprise);
            }
        } else {
            this.selectedTeam = null;
            this.enterpriseTeams = [];
            this.enterpriseVehicles = [];
            this.model.teams = [];
            this.model.groupId = '';
            this.enterpriseVehicles = [];
        }
        this.vehicleStaff = null;
        this.vehicleStatuses = {};
        this.vehiclesEnterPriseStaff = {};
    }
    loadNameTypeVehicle() {
        this.vehicle.forEach(item => {
            if (item.children) {
                item.children.forEach(itemChildren => {
                    this.vehicleName[itemChildren._id] = itemChildren.name;
                });
            } else {
                if (item.name) {
                    this.vehicleName[item._id] = item.name;
                }
            }
        });
    }

    loadNameVehicleAndCapacity() {
        this.vehicleParentName = {};
        this.capacityVehicles = {};
        if (this.enterpriseVehicles) {
            this.enterpriseVehicles.forEach(item => {
                this.vehicleParentName[item._id] = this.vehicleName[
                    item.typeId
                ];
                if (item.capacities) {
                    item.capacities.forEach(itemCapacity => {
                        if (_.isEmpty(this.capacityVehicles[item._id])) {
                            this.capacityVehicles[item._id] = this.vehicleName[
                                itemCapacity
                            ];
                        } else {
                            this.capacityVehicles[item._id].vi = `${this.vehicleName[itemCapacity]
                                }, ${this.capacityVehicles[item._id].vi}`;
                            this.capacityVehicles[item._id].en = `${this.vehicleName[itemCapacity]
                                }, ${this.capacityVehicles[item._id].en}`;
                        }
                    });
                }
            });
        }
    }

    async getBanks() {
        const query = new QueryModel({
            limit: 1000,
            status: `${Status.ACTIVE}`
        });
        const bankPaging = await this.bankService.filter(query);
        this.banks = _.map(bankPaging.data, item => item.name);
    }

    async loadUserLevels() {
        if (!this.isEnterpriseStaffServicer) {
            const query = new QueryModel({
                limit: 1000,
                status: `${Status.ACTIVE}`
            });
            const userLevels = await this.userLevelService.getUserLevels(query);
            this.listUserLevel = userLevels.data;
            if (
                !this.model.serveLevelIds ||
                _.isEmpty(this.model.serveLevelIds)
            ) {
                this.model.serveLevelIds = [];
                for (const item of this.listUserLevel) {
                    if (item.default) {
                        this.model.serveLevelIds.push(item._id);
                    }
                }
            }
        }
    }
}
