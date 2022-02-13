import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DashboardSummaryModel } from './../../models/dashboard-summary.model';
import { GroupServicer } from '../../../../modules/servicer/models/group-servicer/group-servicer.model';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderService } from 'app/modules/order/services/order.service';
import { OrderStatus } from './../../../../constants/OrderStatus';
import { QueryModel } from '../../../../models/query.model';
import { Servicer } from '../../../../modules/servicer/models/servicer/servicer.model';
import { ServicerLocationModel } from 'app/modules/location/models/servicer-location.model';
import { ServicerService } from './../../../../modules/servicer/services/servicer.service';
import { SimpleChanges } from '@angular/core';
import { WalletModel } from 'app/modules/finance/models/wallet.model';

@Component({
    selector: 'servicers',
    templateUrl: 'servicers.component.html',
    styles: [`
        .active {
            background: #007bff;
            color: #fff;

            .link {
                color: #fff;
            }
        }
        .small-icon {
            height: 20px;
        }
        .active-border {
            border-left: 5px solid #770
        }
        .offline {
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
        }
        .scrollable {max-height: 100vh; overflow-y: auto;}
        `]
})
export class ServicersComponent implements OnChanges, OnInit {
    @Input() locations: ServicerLocationModel[] = [];
    @Input() servicers: { [index: string]: Servicer } = {};
    @Input() doingServicers: Servicer[] = [];
    @Input() doingOrders: OrderModel[] = [];
    @Input() collectionDebtWallets: { [index: string]: WalletModel[] } = {};
    @Input() selected: Servicer = null;
    @Input() groups: GroupServicer[] = [];
    @Output() onSelect = new EventEmitter<Servicer>();

    incidentsQuery = new QueryModel({ limit: 1000, status: `${OrderStatus.ProcessingIncident},${OrderStatus.Incident}`, fields: '_id,code,servicerId' });
    incidentsByServicer = {};
    collapseItems: string[] = [];
    numberOfServicers = 0;
    dashboardSummaryData = new DashboardSummaryModel();

    constructor(public servicerService: ServicerService, public orderService: OrderService) { }

    public async ngOnInit() {
        const servierPaging = await this.servicerService.getServicers(new QueryModel({ limit: 1 }));
        this.numberOfServicers = servierPaging.total;
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.selected) {
            return;
        }
        const validTime = Date.now() - 10 * 60000;
        const allMembers = [];
        for (const group of this.groups) {
            const servicerPaging = await this.servicerService.getServicers(new QueryModel({ groupId: group._id, limit: 1 }));
            group.numberOfMembers = servicerPaging.total;
            const members = [];
            _.forEach(this.servicers, (_servicers) => {
                const servicer = _servicers[0];
                const currentLocation = _.find(this.locations, y => y.servicerId === servicer._id);
                if (servicer.groupId === group._id && currentLocation) {
                    servicer.state = currentLocation.updatedAt > validTime;
                    members.push(servicer);
                    allMembers.push(servicer);
                }
            });
            group.members = members;
        }
        if (this.locations.length > 0) {
            if (changes['locations']) {
                this.incidentsByServicer = _.groupBy(await this._getOrderByManyServicerIds(this.incidentsQuery, _.map(this.locations, x => x.servicerId)), x => x.servicerId);
            }
        } else {
            this.incidentsByServicer = {};
        }

        let collectionDebt = 0;
        for (const key in this.collectionDebtWallets) {
            if (this.collectionDebtWallets.hasOwnProperty(key)) {
                collectionDebt += this.collectionDebtWallets[key][0].collectionDebt;
            }
        }
        const acceptedAndReturnOrders = await this._getOrderByManyServicerIds(new QueryModel({ fields: '_id,status', status: `${OrderStatus.Accepted},${OrderStatus.Return}` }), _.map(allMembers, x => x._id));
        const acceptedOrders = _.filter(acceptedAndReturnOrders, x => x.status === OrderStatus.Accepted);
        _.assignIn(this.dashboardSummaryData, {
            collectionDebt,
            doingOrders: this.doingOrders.length,
            acceptedOrders: acceptedOrders.length,
            returnOrders: acceptedAndReturnOrders.length - acceptedOrders.length,
            incidents: Object.keys(this.incidentsByServicer).length,
            offline: _.filter(allMembers, member => !member.state).length,
            freeServicers: allMembers.length - this.doingServicers.length
        });
    }

    select(servicer: Servicer) {
        this.selected = servicer;
        this.onSelect.emit(servicer);
    }

    updateCollapse(groupId: string = null) {
        if (this.collapseItems.includes(groupId)) {
            this.collapseItems = this.collapseItems.filter(x => x !== groupId);
        } else {
            this.collapseItems.push(groupId);
        }
    }

    async _getOrderByManyServicerIds(query: QueryModel, servicerIds = []) {
        query.limit = 1000;
        const limit = 25;
        let orders = [];
        for (let index = 0; index < servicerIds.length; index += limit) {
            query.servicerIds = servicerIds.slice(index, index + limit).join(',');
            const orderPaging = await this.orderService.getOrders(query);
            orders = _.concat(orders, orderPaging.data);
        }

        return orders;
    }
}
