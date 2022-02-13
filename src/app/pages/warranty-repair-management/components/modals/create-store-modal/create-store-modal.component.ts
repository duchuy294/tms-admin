import * as _ from 'lodash';
import * as moment from 'moment';
import { AddStore, EditStore } from '@/modules/warranty-repair/actions/store.actions';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CreateStore } from '@/modules/warranty-repair/models/create-store.model';
import { FilterService } from '@/utility/services/filter.service';
import { getUpdatedStoreSelector } from '@/modules/warranty-repair/reducers';
import { IsMemberStatus } from '@/constants/IsMemberStatus';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/utility/models/filter.model';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { Store } from '@ngrx/store';
import { StoreService } from '@/modules/warranty-repair/services/store.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-store-modal',
    templateUrl: './create-store-modal.component.html',
    styleUrls: ['./create-store-modal.component.less']
})
export class CreateStoreModalComponent implements OnInit {
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();
    tabIndex: number = 0;
    @ViewChild('storeForm') storeForm: NgForm;
    isMemberValue = [IsMemberStatus.NOT_PARTICIPATE, IsMemberStatus.JOINED];
    memberList: any[] = [];
    model = new CreateStore();
    servicerData = new PagingModel<Servicer>();
    servicerQueryModel = new QueryModel();
    addressError: boolean = false;
    brandModel: string;
    unBrandModel: string;
    groups: Selection[] = [];
    teams: Selection[] = [];
    teamsQuery: any;
    cities: Selection[] = [];
    districts: Selection[] = [];
    brands: Selection[] = [];
    brandsQuery: any;
    productTypes: Selection[] = [];
    productTypesQuery: any;
    loadedCounter: number = 0;
    images = [];
    verifiedCertificateImages = [];
    businessCertificateImages = [];
    contractImages = [];
    selectedStaffId: string = null;
    selectedStaff: any = null;
    staffList: any = null;
    location: any;
    address?: string;

    teamSelected: any;
    authorizedBrands: {};
    unAuthorizedBrands: {};

    openTime: string;
    closeTime: string;
    startDay: number;
    endDay: number;
    workingHours: any;
    daysInWeek = [2, 3, 4, 5, 6, 7, 8];
    openTimeDefault = new Date();
    endTimeDefault = new Date();
    mapVisible: boolean = false;

    status = [
        Status.NEW,
        Status.ACTIVE,
        Status.SUSPENDED,
        Status.DELETED
    ];


    constructor(
        private storeService: StoreService,
        private filterService: FilterService,
        private servicerService: ServicerService,
        private messageService: NzMessageService,
        private zone: NgZone,
        private store: Store<{}>,
        private translateService: TranslateService
    ) {
        this.store.select(getUpdatedStoreSelector).pipe(
        ).subscribe(val => {
            if (val === 'success') {
                this.submit.emit({
                    success: true,
                    type: 'update'
                });
            }
        });
    }

    @Input()
    set storeModel(value: CreateStore) {
        this.model = value;
        if (this.model.city) {
            (async () => {
                await this.loadEditData();
            })();
        }
    }

    async loadEditData() {
        if (this.model.location && this.model.location.latitude && this.model.location.longitude) {
            this.model.location.lag = this.model.location.latitude;
            this.model.location.lng = this.model.location.longitude;
        }
        if (this.model.city) {
            this.districts = await this.filterService.getDistricts(
                this.model.city
            );
        }
        if (this.model.workingHours && this.model.workingHours.length) {
            this.model.workingHours.forEach(workTime => {
                this.workingHours = {
                    ...this.workingHours,
                    [_.uniqueId()]: {
                        ...workTime
                    }
                };
            });
        }
        if (this.model.teamIds && this.model.teamIds.length) {
            if (!this.teams.length) {
                await this.getTeams();
            }
            this.model.teamIds.forEach(teamId => {
                this.teamSelected = {
                    ...this.teamSelected,
                    [teamId]: this.teamsQuery[teamId]
                };
            });
        }

        if (this.model.images.length) {
            const images = [];
            this.model.images.forEach(image => {
                images.push({
                    url: image,
                    status: 'done'
                });
            });
            this.images = images;
        }
        if (this.model.contractImages.length) {
            const contractImages = [];
            this.model.contractImages.forEach(image => {
                contractImages.push({
                    url: image,
                    status: 'done'
                });
            });
            this.contractImages = contractImages;
        }
        if (this.model.businessCertificateImages.length) {
            const businessCertificateImages = [];
            this.model.businessCertificateImages.forEach(image => {
                businessCertificateImages.push({
                    url: image,
                    status: 'done'
                });
            });
            this.businessCertificateImages = businessCertificateImages;
        }
        if (this.model.verifiedCertificateImages.length) {
            const verifiedCertificateImages = [];
            this.model.verifiedCertificateImages.forEach(image => {
                verifiedCertificateImages.push({
                    url: image,
                    status: 'done'
                });
            });
            this.verifiedCertificateImages = verifiedCertificateImages;
        }
        if (
            !_.isEmpty(this.model.authorizedBrands) ||
            !_.isEmpty(this.model.authorizedBrands)
        ) {
            if (_.isEmpty(this.brandsQuery)) {
                await this.getBranches();
            }
            if (_.isEmpty(this.productTypesQuery)) {
                await this.getProductTypes();
            }
        }

        this.authorizedBrands = { ...this.model.authorizedBrands };
        this.unAuthorizedBrands = { ...this.model.unauthorizedBrands };
        if (this.model.owner) {
            const servicerData = await this.servicerService.get(
                this.model.owner
            );
            if (servicerData.code) {
                this.servicerQueryModel.code = servicerData.code;
                this.servicerData = await this.servicerService.getServicers(
                    this.servicerQueryModel
                );
            }
            this.memberList = await this.servicerService.getStaffs(
                this.model.owner
            );
        }
        this.model.staffIds.forEach(staffId => {
            this.memberList.forEach(staff => {
                if (staff._id === staffId) {
                    this.addOneStaff(staff);
                }
            });
        });
    }

    async ngOnInit() {
        this.openTimeDefault.setHours(8, 0);
        this.endTimeDefault.setHours(17, 0);
        await this.getCities();
        this.loadedCounter++;
    }

    updateLocation($event) {
        this.model.location = {
            latitude: $event.geometry.location.lat(),
            longitude: $event.geometry.location.lng(),
            lat: $event.geometry.location.lat(),
            lng: $event.geometry.location.lng()
        };
        this.model.mapAddress = $event.formatted_address;
    }

    updateContentImg($event, imageType: string) {
        this.model[imageType] = $event;
    }

    async onSelectTag($event) {
        if (this.loadedCounter < 2 && $event === 1) {
            await this.getGroups();
            await this.getTeams();
            await this.getBranches();
            await this.getProductTypes();
            this.loadedCounter++;
        }
    }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    async changeGroup() {
        this.teamSelected = {};
        await this.getTeams();
    }

    async getBranches() {
        this.brands = await this.storeService.getBrands(
            new QueryModel({ limit: 1000 })
        );
        this.brandsQuery = _.mapKeys(this.brands, '_id');
    }

    async getProductTypes() {
        this.productTypes = await this.storeService.getProductTypes(
            new QueryModel({ limit: 1000 })
        );
        this.productTypesQuery = _.mapKeys(this.productTypes, '_id');
    }

    async getCities() {
        this.cities = await this.filterService.getCities();
    }

    async getDistricts() {
        this.model.district = '';
        this.districts = await this.filterService.getDistricts(this.model.city);
    }

    async getGroups() {
        const result = await this.servicerService.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.groups = result.data;
    }

    async getTeams() {
        this.teams = await this.filterService.getTeams();
        if (this.model.groupId !== undefined && this.model.groupId !== '') {
            this.teamsQuery = _.mapKeys(this.teams, '_id');
        }
    }

    removeTeam(team) {
        if (
            team &&
            team.value &&
            !_.isEmpty(this.teamSelected) &&
            this.teamSelected[team.value._id]
        ) {
            delete this.teamSelected[team.value._id];
        }
    }

    addTeam() {
        if (!this.model.teamId) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.team-to-add-required'));
            return;
        }
        this.teams.forEach(team => {
            if (
                this.model.teamId === team._id &&
                !this.teamSelected[this.model.teamId]
            ) {
                this.teamSelected = {
                    ...this.teamSelected,
                    [this.model.teamId]: team
                };
            }
        });
        this.model.teamId = '';
    }

    async addOwner() {
        if (!this.servicerQueryModel.code) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.enterprise-code-required'));
            return;
        }
        this.servicerData = await this.servicerService.getServicers(
            this.servicerQueryModel
        );
        if (!this.servicerData.total) {
            this.messageService.error(this.translateService.instant('warranty-repair.validation.not-existed-enterprise-code'));
            return;
        }
        this.memberList = await this.servicerService.getStaffs(
            this.servicerData.data[0]._id
        );
    }

    deleteOwner() {
        this.servicerData = new PagingModel<Servicer>();
        this.servicerQueryModel = new QueryModel();
        this.memberList = [];

        this.selectedStaff = null;
        this.staffList = {};
    }

    addWorkingHours() {
        if (
            !this.openTime &&
            !this.closeTime &&
            !this.startDay &&
            !this.endDay
        ) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.invalid-working-hours'));
            return;
        }

        this.workingHours = {
            ...this.workingHours,
            [_.uniqueId()]: {
                openTime: moment(this.openTime).format('HH:mm'),
                closeTime: moment(this.closeTime).format('HH:mm'),
                startDay: this.startDay,
                endDay: this.endDay
            }
        };
        this.openTime = null;
        this.closeTime = null;
        this.startDay = null;
        this.endDay = null;
    }

    removeWorkingHours(id) {
        if (!_.isEmpty(this.workingHours) && this.workingHours[id]) {
            delete this.workingHours[id];
            this.workingHours = {
                ...this.workingHours
            };
        }
    }

    addAllTeam() {
        if (!this.model.groupId) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.group-required'));
            return;
        }
        if (this.teams.length) {
            this.teams.forEach(team => {
                this.teamSelected = {
                    ...this.teamSelected,
                    [team._id]: team
                };
            });
        }
    }

    checkAddressValid() {
        this.addressError = false;
        if (!this.model.location || _.isEmpty(this.model.location)) {
            this.addressError = true;
        }
    }

    async onCreateStore() {
        this.checkAddressValid();
        if (this.storeForm.valid) {
            if (!this.model.images.length) {
                this.messageService.warning(this.translateService.instant('validations-form.avatar.required'));
                return;
            }

            if (!_.size(this.teamSelected)) {
                this.messageService.warning(this.translateService.instant('warranty-repair.validation.team-required'));
                this.tabIndex = 1;
                return;
            }
            this.model.teamIds = [];
            _.forEach(this.teamSelected, team => {
                if (team && team._id) {
                    this.model.teamIds.push(team._id);
                }
            });

            this.model.workingHours = _.toArray(this.workingHours);
            if (!_.isEmpty(this.authorizedBrands)) {
                this.model.authorizedBrands = this.authorizedBrands;
            }
            if (!_.isEmpty(this.unAuthorizedBrands)) {
                this.model.unauthorizedBrands = this.unAuthorizedBrands;
            }
            if (this.servicerData.data.length) {
                this.model.owner = this.servicerData.data[0]._id;
            } else {
                this.model.owner = '';
            }
            if (this.staffList) {
                this.model.staffIds = [];
                for (const staff of Object.keys(this.staffList)) {
                    this.model.staffIds.push(staff);
                }
            }

            this.store.dispatch(
                this.model._id
                    ? new EditStore(this.model)
                    : new AddStore(this.model)
            );
        } else {
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
            this.tabIndex = 0;
            CommonHelper.validateForm(this.storeForm);
        }
    }

    updateAuthorizedBrands({ brand, productType }) {
        if (this.authorizedBrands && this.authorizedBrands[brand]) {
            this.authorizedBrands = {
                ...this.authorizedBrands,
                [brand]: [...this.authorizedBrands[brand], productType]
            };
        }
    }

    updateUnAuthorizedBrands({ brand, productType }) {
        if (this.unAuthorizedBrands && this.unAuthorizedBrands[brand]) {
            this.unAuthorizedBrands = {
                ...this.unAuthorizedBrands,
                [brand]: [...this.unAuthorizedBrands[brand], productType]
            };
        }
    }

    removeAuthorizedProductTypes({ brand, productType }) {
        if (this.authorizedBrands && this.authorizedBrands[brand]) {
            const productTypes = this.authorizedBrands[brand];
            const indexFind = productTypes.indexOf(productType);
            if (indexFind !== -1) {
                productTypes.splice(indexFind, 1);
                this.authorizedBrands = {
                    ...this.authorizedBrands,
                    [brand]: productTypes
                };
            }
        }
    }

    removeUnAuthorizedProductTypes({ brand, productType }) {
        if (this.unAuthorizedBrands && this.unAuthorizedBrands[brand]) {
            const productTypes = this.unAuthorizedBrands[brand];
            const indexFind = productTypes.indexOf(productType);
            if (indexFind !== -1) {
                productTypes.splice(indexFind, 1);
                this.unAuthorizedBrands = {
                    ...this.unAuthorizedBrands,
                    [brand]: productTypes
                };
            }
        }
    }

    removeAuthorizedBrand($event?) {
        if ($event) {
            if (this.authorizedBrands && this.authorizedBrands[$event]) {
                delete this.authorizedBrands[$event];
                this.authorizedBrands = { ...this.authorizedBrands };
            }
        } else {
            this.authorizedBrands = {};
        }
    }

    removeUnAuthorizedBrand($event?) {
        if ($event) {
            if (this.unAuthorizedBrands && this.unAuthorizedBrands[$event]) {
                delete this.unAuthorizedBrands[$event];
                this.unAuthorizedBrands = { ...this.unAuthorizedBrands };
            }
        } else {
            this.unAuthorizedBrands = {};
        }
    }

    addAuthorizedBrand() {
        if (!this.brandModel) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.authorized-brand-required'));
            return;
        }
        if (
            this.brandsQuery[this.brandModel] &&
            (!this.authorizedBrands || !this.authorizedBrands[this.brandModel])
        ) {
            this.authorizedBrands = {
                ...this.authorizedBrands,
                [this.brandModel]: []
            };
        }
        this.brandModel = null;
    }

    addUnAuthorizedBrand() {
        if (!this.unBrandModel) {
            this.messageService.warning(
                this.translateService.instant('warranty-repair.validation.unauthorized-brand-required')
            );
            return;
        }
        if (
            this.brandsQuery[this.unBrandModel] &&
            (!this.unAuthorizedBrands ||
                !this.unAuthorizedBrands[this.unBrandModel])
        ) {
            this.unAuthorizedBrands = {
                ...this.unAuthorizedBrands,
                [this.unBrandModel]: []
            };
        }
        this.unBrandModel = null;
    }

    addOneStaff(staff = null) {
        if (staff === null) {
            staff = this.selectedStaff;
        }
        if (!staff) {
            this.messageService.warning(this.translateService.instant('warranty-repair.validation.unselected-staff'));
        } else {
            if (this.staffList === null) {
                this.staffList = {
                    [staff._id]: staff
                };
            } else if (!this.staffList[staff._id]) {
                this.staffList = {
                    ...this.staffList,
                    [staff._id]: staff
                };
            }
        }
    }

    addAllStaffs() {
        this.memberList.forEach(staff => {
            this.addOneStaff(staff);
        });
    }

    removeStaff(staff) {
        if (
            staff &&
            staff.value &&
            !_.isEmpty(this.staffList) &&
            this.staffList[staff.value._id]
        ) {
            delete this.staffList[staff.value._id];
        }
    }

    onCancelModal() {
        this.staffList = {};
        this.model.staffIds.forEach(staffId => {
            this.memberList.forEach(staff => {
                if (staff._id === staffId) {
                    this.addOneStaff(staff);
                }
            });
        });
        this.handleVisibleModal(false);
    }

    async getMapsCenter(center) {
        this.zone.run(() => {
            this.model.location = {
                latitude: center.lat,
                longitude: center.lng,
                lat: center.lat,
                lng: center.lng
            };
            this.model.mapAddress = center.mapAddress;
        });
    }

    reset() {
        this.model = new CreateStore();
        this.storeForm.resetForm(this.model);
        this.images = [];
        this.contractImages = [];
        this.businessCertificateImages = [];
        this.verifiedCertificateImages = [];
        this.teamSelected = {};
        this.unAuthorizedBrands = {};
        this.authorizedBrands = {};
        this.workingHours = {};
        this.addressError = false;
        this.servicerQueryModel = new QueryModel();
        this.servicerData = new PagingModel<Servicer>();
        this.tabIndex = 0;
    }
    toggleMapVisible() {
        this.mapVisible = !this.mapVisible;
    }
}
