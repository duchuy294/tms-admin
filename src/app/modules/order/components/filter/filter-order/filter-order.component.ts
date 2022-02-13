import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHelper } from '@/utility/common/common.helper';
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { OrderQueryModel } from 'app/pages/order-management/models/order-query.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { UserType } from '@/constants/UserType';
import { OrderSource } from '@/constants/OrderSource';
import { OrderDeliveryType } from '@/constants/OrderDeliveryType';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
// import moment from "moment";

@Component({
    selector: 'filter-order',
    templateUrl: 'filter-order.component.html'
})
export class FilterOrderComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private servicerService: ServicerService
    ) {}

    modelQuery = new OrderQueryModel({
        status: null,
        serviceType: null,
        limit: 60,
        fields:
            'code,createdAt,userId,status,progress,services,userCost,baseUserCost,servicerCost,payment,servicerId,serviceType,costDetail,prePaid,processedBy,adminNote,externalCode,packages'
    });
    constUserType = UserType;
    isLoading = false;
    startTime: Date[];
    finishTime: Date[];
    assignTime: Date[];
    customers: string[];
    servicers: string[];
    statuses = [
        OrderStatus.Timeout,
        OrderStatus.ProcessingTimeout,
        OrderStatus.ProcessedTimeout,
        OrderStatus.FindingServicer,
        OrderStatus.Accepted,
        OrderStatus.CanceledByUser,
        OrderStatus.CanceledByServicer,
        OrderStatus.CanceledByAdmin,
        OrderStatus.InProgress,
        OrderStatus.Finished,
        OrderStatus.FinishedWithReturn,
        OrderStatus.Return,
        OrderStatus.Incident,
        OrderStatus.ProcessingIncident,
        OrderStatus.WatingToConfirm,
        OrderStatus.FailedInstallation,
        OrderStatus.Pending,
        OrderStatus.PendingReturned
    ];
    serviceTypes = [
        OrderType.DELIVERY,
        OrderType.INSTALL,
        OrderType.DELIVERY_INSTALL,
        OrderType.WARRANTY_REPAIR
    ];
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    _selectedCustomer = null;
    _selectedSubCustomer = null;
    _selectedServicer = null;
    _selectedOperator = null;
    customerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    subCustomerSearchCondition = {
        fields: 'fullName,phone,code',
        type: UserType.ENTERPRISE
    };
    servicerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    operatorSearchCondition = {
        fields: 'fullName,phone,code',
        type: UserType.OPERATOR
    };
    _serviceType = [];
    _status: number[] = [];
    _source: string = '';
    _deliveryType: string = '';
    defaultType = [
        OrderType.INSTALL,
        OrderType.DELIVERY_INSTALL,
        OrderType.DELIVERY,
        OrderType.WARRANTY_REPAIR
    ];
    orderSource = OrderSource;
    orderDeliveryType = OrderDeliveryType;
    visibleLocation: boolean = false;

    groups = [];
    @ViewChild('filterOrderForm') filterOrderForm: NgForm;

    @Output() onSearch = new EventEmitter<OrderQueryModel>();
    @Output() onReset = new EventEmitter<OrderQueryModel>();

    async ngOnInit() {
        await this.getGroups();
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.userId) {
                this._selectedCustomer = _.split(params.userId, ',');
            }
            if (params['clientBranchIds']) {
                this._selectedSubCustomer = _.split(
                    params['clientBranchIds'],
                    ','
                );
            }
            if (params.serviceType) {
                this._serviceType = _.split(params.serviceType, ',');
            }
            if (params.status) {
                this._status = _.split(params.status, ',').map(x => +x);
            }
            if (params.externalCode) {
                this.modelQuery.externalCode = params.externalCode;
            }
            if (params.pointPhone) {
                this.modelQuery.pointPhone = params.pointPhone;
            }
            if (params.servicerId) {
                this._selectedServicer = _.split(params.servicerId, ',');
            }
            if (params.operatorId) {
                this._selectedOperator = _.split(params.operatorId, ',');
            }
            if (params.startTime && params.endTime) {
                this.startTime = [
                    new Date(parseInt(params.startTime)),
                    new Date(parseInt(params.endTime))
                ];
            } else {
                this.startTime = [];
            }
            if (params.finishedStart && params.finishedEnd) {
                this.finishTime = [
                    new Date(parseInt(params.finishedStart)),
                    new Date(parseInt(params.finishedEnd))
                ];
            } else {
                this.finishTime = [];
            }
            if (params.assignedStart && params.assignedEnd) {
                this.assignTime = [
                    new Date(parseInt(params.assignedStart)),
                    new Date(parseInt(params.assignedEnd))
                ];
            } else {
                this.assignTime = [];
            }
            if (params.source) {
                this._source = params.source;
            }
            if (params.deliveryType) {
                this._deliveryType = params.deliveryType;
            }
            if (params.groupId) {
                this.modelQuery.groupId = params.groupId;
            }
        });
    }

    set selectedCustomer(value) {
        if (_.isArray(value) || value === null) {
            this._selectedCustomer = value;
        }
    }

    get selectedCustomer() {
        return this._selectedCustomer;
    }

    set selectedSubCustomer(value) {
        if (_.isArray(value) || value === null) {
            this._selectedSubCustomer = value;
        }
    }

    get selectedSubCustomer() {
        return this._selectedSubCustomer;
    }

    set selectedServicer(value) {
        if (_.isArray(value) || value === null) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    set selectedOperator(value) {
        if (_.isArray(value) || value === null) {
            this._selectedOperator = value;
        }
    }

    get selectedOperator() {
        return this._selectedOperator;
    }

    reset() {
        this.startTime = [];
        this.finishTime = [];
        this.assignTime = [];
        this._selectedCustomer = null;
        this._selectedSubCustomer = null;
        this._selectedServicer = null;
        this._selectedOperator = null;
        this._serviceType = [];
        this._status = [];
        this._source = '';
        this._deliveryType = '';
        this.modelQuery.externalCode = null;
        this.modelQuery.groupId = null;
        CommonHelper.resetForm(this.filterOrderForm);
        this.router.navigate(['/pages/order'], {
            queryParams: {
                page: 1,
                limit: 60,
                serviceType: _.join(this.defaultType, ',')
            }
        });
    }

    search() {
        const modelQuery = this.getQuery();
        modelQuery.page = 1;
        if (modelQuery.fields) {
            delete modelQuery.fields;
        }
        _.each(modelQuery, (v, k) => {
            if (_.isArray(v)) {
                modelQuery[k] = _.join(v, ',');
            }
        });
        if (!modelQuery.groupId) {
            /* if (!modelQuery.startTime && !modelQuery.endTime) {
                modelQuery.startTime = moment()
                    .startOf('day')
                    .add('-6', 'day')
                    .valueOf();
                modelQuery.endTime = moment()
                    .endOf('day')
                    .valueOf();
                this.startTime = [
                    new Date(modelQuery.startTime),
                    new Date(modelQuery.endTime)
                ];
            } */
        }
        this.router.navigate(['/pages/order'], { queryParams: modelQuery });
    }

    getQuery() {
        const modelQuery = _.cloneDeep(this.modelQuery);
        if (!_.isEmpty(this.startTime)) {
            modelQuery.startTime = DateTimeService.convertDateToTimestamp(
                this.startTime[0]
            );
            modelQuery.endTime = DateTimeService.convertDateToTimestamp(
                this.startTime[1],
                null,
                true
            );
        } else {
            delete modelQuery.startTime;
            delete modelQuery.endTime;
        }

        if (!_.isEmpty(this.finishTime)) {
            modelQuery.finishedStart = DateTimeService.convertDateToTimestamp(
                this.finishTime[0]
            );
            modelQuery.finishedEnd = DateTimeService.convertDateToTimestamp(
                this.finishTime[1],
                null,
                true
            );
        } else {
            delete modelQuery.finishedStart;
            delete modelQuery.finishedEnd;
        }
        if (!_.isEmpty(this.assignTime)) {
            modelQuery.assignedStart = DateTimeService.convertDateToTimestamp(
                this.assignTime[0]
            );
            modelQuery.assignedEnd = DateTimeService.convertDateToTimestamp(
                this.assignTime[1],
                null,
                true
            );
        } else {
            delete modelQuery.assignedStart;
            delete modelQuery.assignedEnd;
        }

        if (!_.isEmpty(this._selectedCustomer)) {
            modelQuery.userId = this._selectedCustomer;
        } else {
            delete modelQuery.userId;
        }
        if (!_.isEmpty(this._selectedSubCustomer)) {
            modelQuery['clientBranchIds'] = this._selectedSubCustomer;
        } else {
            delete modelQuery['clientBranchIds'];
        }

        if (!_.isEmpty(this._selectedServicer)) {
            modelQuery.servicerId = this._selectedServicer;
        } else {
            delete modelQuery.servicerId;
        }

        if (!_.isEmpty(this._selectedOperator)) {
            modelQuery.operatorId = this._selectedOperator;
        } else {
            delete modelQuery.operatorId;
        }

        if (!_.isEmpty(this._serviceType)) {
            modelQuery.serviceType = _.join(this._serviceType, ',');
        } else {
            modelQuery.serviceType = _.join(this.defaultType, ',');
        }
        if (!_.isEmpty(this._status)) {
            modelQuery.status = _.join(this._status, ',');
        } else {
            delete modelQuery.status;
        }
        if (!_.isEmpty(this._source)) {
            modelQuery.source = this._source;
        } else {
            delete modelQuery.source;
        }
        if (!_.isEmpty(this._deliveryType)) {
            modelQuery.deliveryType = this._deliveryType;
        } else {
            delete modelQuery.deliveryType;
        }

        return modelQuery;
    }

    handelVisibleLocation(flag) {
        this.visibleLocation = flag;
    }

    async getGroups() {
        const result = await this.servicerService.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.groups = result.data;
    }
}
