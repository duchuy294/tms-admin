import * as _ from 'lodash';
import { AddressModel } from '@/modules/location/components/address/address.model';
import { Bank, Customer } from '../../../models/customer-detail.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { FormType } from '@/modules/utility/models/form-type';
import { MaintenanceScheduleModel } from './../../../models/customer-maintenance-schedule.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from 'app/models/query.model';
import { ServiceModel } from './../../../../price/models/service.model';
import { ServiceStyle } from '@/modules/price/constants/ServiceStyle';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserStatus } from '@/constants/UserStatus';
import { CustomerType, UserType } from '@/constants/UserType';
import { Selection } from '@/modules/utility/models/filter.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'customer-modify',
    templateUrl: 'customer-modify.component.html'
})
export class CustomerModifyComponent implements OnChanges {
    private _userLevels: UserLevelModel[] = [];
    @Input() customerToModify: Customer = null;
    @Input() formType: FormType = FormType.Create;
    @Input() modalVisible: boolean = false;
    @Input()
    set userLevels(levels: UserLevelModel[]) {
        this._userLevels = levels.filter(x => x.status === Status.ACTIVE);
        this.defaultUserLevelId = this._userLevels.length
            ? this._userLevels[0]._id
            : null;
    }
    get userLevels() {
        return this._userLevels;
    }

    @Output() afterSuccess = new EventEmitter();
    @Output() handleModalVisible = new EventEmitter<boolean>();
    @ViewChild('customerForm') customerForm: NgForm;
    _avatar = [];
    _contractImage = [];
    _certificateImage = [];
    _confirmPassword: string = null;
    error = new Customer();
    banks: string[] = [];
    installationService: ServiceModel[] = [];
    enterpriseList: Customer[] = [];
    isProcessing: boolean = false;
    model: Customer = new Customer({
        type: UserType.INDIVIDUAL,
        status: UserStatus.NEW
    });
    selectedTabIndex: number = 0;
    defaultUserLevelId: string;
    userTypes: number[] = [
        UserType.ENTERPRISE,
        UserType.INDIVIDUAL,
        UserType.OPERATOR,
        UserType.STAFF,
    ];
    _userType = UserType;
    customerTypes: number[] = [
        CustomerType.TRUCK
    ];
    _customerTypes = CustomerType;
    public statusList: UserStatus[] = [
        UserStatus.NEW,
        UserStatus.ACTIVE,
        UserStatus.SUSPENDED,
        UserStatus.DELETED
    ];
    customerSearchCondition = {
        status: UserStatus.ACTIVE
    };
    maintenanceTimes = [];
    maintenanceServices = [];
    group3PLs: Selection[] = [];

    constructor(
        private bankService: BankService,
        private customerService: CustomerService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private userLevelService: UserLevelService,
        private service: ServicerService,

    ) { }

    async ngOnChanges() {
        if (this.modalVisible) {
            this.isProcessing = true;
            await this.getBanks();
            await this.getService();
            await this.getEnterprises();
            await this.getUserLevels();
            await this.initGroups();
            this.init();
            this.isProcessing = false;
        }
    }

    async getService() {
        const services = _.isEmpty(this.model._id) ? await this.customerService.getServicesByUser() : await this.customerService.getServicesByUser(this.model._id);
        let installServiceTree = null;
        _.forEach(services, service => {
            if (service.style === ServiceStyle.Installation) {
                installServiceTree = service;
            }
        });
        this.installationService = [];
        if (!_.isNull(installServiceTree)) {
            this.flatService(installServiceTree);
        }
    }

    flatService(service: ServiceModel) {
        if (!_.isEmpty(service.children)) {
            _.forEach(service.children, child => {
                this.flatService(child);
            });
        } else {
            this.installationService.push(service);
        }
    }

    async getUserLevels() {
        if (this.userLevels.length === 0) {
            const userLevelPaging = await this.userLevelService.getUserLevels(
                new QueryModel({ limit: 1000, status: 2 })
            );
            this.userLevels = userLevelPaging.data;
        }
    }

    async getEnterprises() {
        if (this.enterpriseList.length === 0) {
            const response = await this.customerService.getCustomers(
                new QueryModel({
                    status: UserStatus.ACTIVE,
                    type: UserType.ENTERPRISE
                })
            );
            this.enterpriseList = response.data;
        }
    }

    async getBanks() {
        if (this.banks.length === 0) {
            const query = new QueryModel({
                limit: 1000,
                status: `${Status.ACTIVE}`
            });
            const bankPaging = await this.bankService.filter(query);
            this.banks = _.map(bankPaging.data, item => item.name);
        }
    }

    init() {
        this._confirmPassword = null;
        this._avatar = [];
        this._certificateImage = [];
        this._contractImage = [];
        if (this.customerToModify) {
            if (this.customerToModify.avatar) {
                this._avatar.push({ url: this.customerToModify.avatar });
            }
            if (this.customerToModify.contractImage) {
                this._contractImage.push({
                    url: this.customerToModify.contractImage
                });
            }
            if (
                this.customerToModify.businessCertificateImages &&
                this.customerToModify.businessCertificateImages.length > 0
            ) {
                for (const image of this.customerToModify
                    .businessCertificateImages) {
                    this._certificateImage.push({ url: image });
                }
            }
            this.model = new Customer(this.customerToModify);
        } else {
            this.model = new Customer({
                type: UserType.INDIVIDUAL,
                status: UserStatus.NEW
            });
            if (this.showUserLevel()) {
                _.assignIn(this.model, {
                    userLevelId: this.defaultUserLevelId
                });
            }
        }
        this.maintenanceTimes = [];
        for (let index = 0; index < 31; index++) {
            this.maintenanceTimes.push(index + 1);
        }
        this.model.address =
            this.customerToModify && this.customerToModify.address
                ? new AddressModel(this.customerToModify.address)
                : new AddressModel();
        if (!this.model.settings.hasOwnProperty('maintenance')) {
            this.model.settings.maintenance = new MaintenanceScheduleModel();
        }
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.customerForm);
    }

    async confirm() {
        if (this.isProcessing) {
            return;
        }
        this.model = this.customerService.trimData(this.model);

        if (this.model.settings.maintenance) {
            if (this.model.settings.maintenance.active) {
                if (!this.isMaintenanceDaysValid() || !this.isMaintenanceServicesValid()) {
                    return;
                }
            } else {
                this.model.settings.maintenance.days = [];
                this.model.settings.maintenance.serviceIds = [];
            }
        }

        if (this.customerForm.valid) {
            if (
                !this.model._id &&
                this.model.password !== this._confirmPassword
            ) {
                this.messageService.warning(
                    this.translateService.instant('common.invalid-data')
                );
                return;
            }

            if (this.model.type === UserType.ENTERPRISE) {
                if (this.model.customerType === CustomerType.TRUCK) {
                    if (!this.model.address.lat || !this.model.address.lng || !this.model.address.street) {
                        this.messageService.warning(
                            this.translateService.instant('Vui lòng cập nhật địa chỉ, kinh độ, vĩ độ')
                        );
                        return;
                    }
                }
            }
            this.isProcessing = true;
            const response = this.model._id
                ? await this.customerService.updateCustomer(this.model)
                : await this.customerService.createCustomer(this.model);
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSuccess.emit();
                this.messageService.success(
                    this.translateService.instant('common.successfully')
                );
                this.onCancel();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.customerForm);
            this.messageService.warning(
                this.translateService.instant('common.invalid-data')
            );
        }
    }

    onCancel() {
        this.handleModalVisible.emit(false);
        this.reset();
    }

    updateAvatarImg($event) {
        if ($event.length > 0) {
            this.model.avatar = $event[0];
        } else {
            this.model.avatar = null;
        }
    }

    showUserLevel(): boolean {
        return (
            (this.model &&
                this.model.type &&
                this.model.type === UserType.ENTERPRISE) ||
            this.model.type === UserType.INDIVIDUAL
        );
    }

    isIndividualOrEnterprise(): boolean {
        return (
            (this.model &&
                this.model.type &&
                this.model.type === UserType.ENTERPRISE) ||
            this.model.type === UserType.INDIVIDUAL
        );
    }

    updateContractImg($event) {
        if ($event.length > 0) {
            this.model.contractImage = $event[0];
        } else {
            this.model.contractImage = null;
        }
    }

    handleTypeChange() {
        if (!this.isIndividualOrEnterprise()) {
            this._contractImage = [];
            delete this.model.contractImage;
            delete this.model.bank;
            delete this.model.maxCollection;
            delete this.model.minCollection;
            delete this.model.note;
            delete this.model.staffId;
            delete this.model.contractNumber;
            delete this.model.referralId;
        } else {
            if (!this.model.bank) {
                this.model.bank = new Bank();
                this.model.minCollection = 0;
                this.model.maxCollection = 0;
            }
        }
        if (!this.isEnterprise()) {
            this._certificateImage = [];
            delete this.model.businessCertificateImages;
        }
        if (!this.isStaff()) {
            delete this.model.enterpriseId;
        }
        if (this.showUserLevel()) {
            this.model.userLevelId = this.defaultUserLevelId;
        } else {
            delete this.model.userLevelId;
        }
    }

    isEnterprise(): boolean {
        return (
            this.model &&
            this.model.type &&
            this.model.type === UserType.ENTERPRISE
        );
    }

    updateCertificateImg($event) {
        if ($event.length > 0) {
            this.model.businessCertificateImages = $event;
        } else {
            this.model.businessCertificateImages = null;
        }
    }

    isStaff(): boolean {
        return (
            this.model && this.model.type && this.model.type === UserType.STAFF
        );
    }

    isMaintenanceDaysValid(): boolean {
        return !_.isEmpty(this.model.settings.maintenance.days);
    }

    isMaintenanceServicesValid(): boolean {
        return !_.isEmpty(this.model.settings.maintenance.serviceIds);
    }

    private async initGroups() {
        const result = await this.service.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.group3PLs = result.data;
        if (!this.model._id) {
            this.model.servicerGroupId = null;
        }
    }

}
