import * as _ from 'lodash';
import { AccountType } from 'app/constants/AccountType';
import { ActivatedRoute } from '@angular/router';
import { CollectionOrderComponent } from '../collection-order/collection-order.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterService } from '../../../../../modules/utility/services/filter.service';
import { MultiLanguageString } from './../../../../../models/multi-language/multi-string';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderGridComponent } from './../../../../../modules/order/components/order-grid/order-grid.component';
import { OrderModel } from './../../../../../modules/order/models/order.model';
import { OrderQueryModel } from '@/pages/order-management/models/order-query.model';
import { PagingModel } from '../../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { Selection } from '../../../../../modules/utility/models/filter.model';
import { Servicer } from '../../../../../modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '../../../../../modules/servicer/services/servicer.service';
import { ServicerType } from 'app/constants/ServicerType';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { VehicleService } from '../../../../../modules/delivery/services/vehicle.service';
import { VehicleType } from '../../../../../models/vehicle-type.model';
import { WalletModel } from 'app/modules/finance/models/wallet.model';
import { WalletService } from '../../../../../modules/finance/services/wallet.service';

@Component({
    selector: 'servicer-detail',
    templateUrl: 'servicer-detail.component.html',
    styleUrls: ['servicer-detail.component.less']
})
export class ServicerDetailComponent implements OnInit {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    images = [];
    visibleStaffDetail: boolean = false;
    model: Servicer = new Servicer();
    public groupName: { [_id: string]: any } = {};
    public displayCreate: boolean = false;
    public displayModify: boolean = false;
    public groups: Selection[] = [];
    public modifyModel = new Servicer();
    public orderPaging: PagingModel<OrderModel> = new PagingModel();
    public selectedTeamId: string;
    public servicer = new Servicer();
    public servicerId: string;
    public teams: Selection[] = [];
    public vehicle: VehicleType[] = [];
    public wallet = new WalletModel();
    ratingListVisibleModal: boolean = false;
    userLevelName: { [_id: string]: string } = {};
    visibleModal: boolean = false;
    vehicleName: { [_id: string]: MultiLanguageString } = {};
    query: OrderQueryModel;
    historyTransactionQuery = new QueryModel();
    historyTransactionGridVisible = false;
    lang = 'vi';

    get servicerRating() {
        return this.servicer && this.servicer.rate ? this.servicer.rate : 5;
    }

    get notRated() {
        if (this.servicer) {
            if (this.servicerRating < 5) {
                return false;
            }
            if (!this.servicer.rateTimes || this.servicer.rateTimes === 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    get isPersonalServicer() {
        return this.servicer.type === ServicerType.Personal;
    }

    get isEnterpriseServicer() {
        return this.servicer.type === ServicerType.Enterprise;
    }

    get isEnterpriseStaffServicer() {
        return this.servicer.type === ServicerType.EnterpriseStaff;
    }

    constructor(
        private filterService: FilterService,
        private messageService: NzMessageService,
        private ngbModalService: NgbModal,
        private route: ActivatedRoute,
        private service: ServicerService,
        private userLevelService: UserLevelService,
        private vehicleService: VehicleService,
        private walletService: WalletService,
        private readonly translateService: TranslateService
    ) { }

    async ngOnInit() {
        this.servicerId = this.route.snapshot.paramMap.get('id');
        this.query = new QueryModel({
            servicerId: this.servicerId,
            page: this.orderPaging.page,
            limit: this.orderPaging.limit
        });
        await this._loadServicer();
        await this.getSelection();
        this._loadTypeVehicle();
        this.lang = this.translateService.currentLang;
    }

    async pageChange() {
        await this._loadOrders();
    }

    async _loadServicer() {
        this.servicer = await this.service.get(this.servicerId);
        this.images = [];
        if (this.servicer.images.length) {
            this.servicer.images.forEach(image => {
                this.images.push({
                    uid: _.uniqueId(),
                    status: 'done',
                    url: image
                });
            });
        }
        this.images = [...this.images];
        this.wallet = await this.walletService.get(
            this.servicerId,
            AccountType.SERVICER
        );
        if (this.servicer.userLevelIds) {
            const response = await this.userLevelService.getUserLevels(
                new QueryModel({
                    limit: 1000,
                    userLevelIds: this.servicer.userLevelIds
                })
            );
            response.data.forEach(userLevel => {
                this.userLevelName[userLevel._id] = userLevel.name;
            });
        }
    }

    async _loadOrders() {
        this.orderGrid.loadData(this.query);
    }

    async getSelection() {
        const vehicle = await this.vehicleService.getVehicleTypes();
        this.vehicle = vehicle;
        const result = await this.service.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.groups = result.data;
        result.data.forEach(item => {
            this.groupName[item._id] = item.name;
        });
        await this.updateTeamSelectList();
    }

    _loadTypeVehicle() {
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

    async updateServicer() {
        if (!this.servicer.images.length) {
            this.messageService.warning('Vui lòng chọn hình ảnh');
            return;
        }
        const result = await this.service.updateServicer(this.servicer);
        this.messageService[result.errorCode ? 'error' : 'success'](
            `Cập nhật ${result.errorCode ? 'thất bại' : 'thành công'}`
        );
    }

    async updateTeamSelectList() {
        this.teams = await this.filterService.getTeams();
        if (this.teams && this.teams.length > 0) {
            this.selectedTeamId = this.teams[0]._id;
        }
    }

    async addTeamServicer() {
        const selectedTeam = this.teams.find(
            team => team._id === this.selectedTeamId
        );

        this.servicer.teams = _.union(this.servicer.teams, [
            _.pick(selectedTeam, ['_id', 'name'])
        ]) as TeamServicer[];
    }

    updateImages($event) {
        if ($event.length > 0) {
            this.servicer.images = [$event[0]];
        } else {
            this.servicer.images = null;
        }
    }

    openCollectionOrderModal() {
        const collectionOrderModel = this.ngbModalService.open(
            CollectionOrderComponent,
            { size: 'lg', windowClass: 'modal-70-percent' }
        ).componentInstance as CollectionOrderComponent;
        collectionOrderModel.query.servicerId = this.servicerId;
        collectionOrderModel.wallet = this.wallet;
    }

    handleVisibleModal(flag = false) {
        this.visibleModal = !!flag;
    }

    openModificationModal() {
        this.handleVisibleModal(true);

        this.model = _.cloneDeep(this.servicer);
    }

    openFinanceHistoryModal() {
        this.historyTransactionQuery.userId = this.servicer._id;
        this.handleHistoryTransactionGridVisible(true);
    }

    handleRatingListVisibleModal(flag = false) {
        this.ratingListVisibleModal = !!flag;
    }

    handleVisibleStaffDetail(flag = false) {
        this.visibleStaffDetail = !!flag;
    }

    handleHistoryTransactionGridVisible(flag = true) {
        this.historyTransactionGridVisible = !!flag;
    }
}