import * as _ from 'lodash';
import * as servicerAction from '@/modules/servicer/actions/servicer.actions';
import { assignIn, cloneDeep, concat, filter, forEach, groupBy, isEmpty, mapKeys, pickBy, uniq } from 'lodash';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardStatisticsQueryModel } from '@/modules/report/models/dashboard-statistics-query.model';
import { getReportState, selectServicerData, selectServicerHasMore, selectServicerLoading, selectStatisticLoading } from '@/modules/report/reducers/dashboard-statistics.reducers';
import { GetServicersList, LoadStatistics } from '@/modules/report/actions/dashboard-statistics.actions';
import { GroupServicer } from '@/modules/servicer/models/group-servicer/group-servicer.model';
import { LatLngBounds, Marker } from '@agm/core/services/google-maps-types';
import { LoadTeamsByGroup } from '@/modules/servicer/actions/team.action';
import { LoadTotalServicersState } from '@/modules/servicer/actions/servicer.actions';
import { LocationQueryModel } from '@/modules/location/models/location-query.model';
import { LocationService } from '@/modules/location/services/location.service';
import { map } from 'rxjs/operators';
import { OrderModel } from './../../../../modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { selectServicerCurrentGroup, selectServicerGroups, selectServicerState } from '@/modules/servicer/reducers';
import { Servicer } from './../../../../modules/servicer/models/servicer/servicer.model';
import { ServicerLocationModel } from '@/modules/location/models/servicer-location.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Store } from '@ngrx/store';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { UserStatus } from '@/constants/UserStatus';
import { VehicleService } from '@/modules/delivery/services/vehicle.service';
import { WalletService } from '@/modules/finance/services/wallet.service';

@Component({
    selector: 'dashboard-v2',
    templateUrl: './dashboard-v2.component.html',
    styleUrls: ['./dashboard-v2.component.less']
})
export class DashboardV2Component implements OnInit, OnDestroy {
    flagExpandingTeams = {};
    lat = 10.7546658;
    lng = 106.4143548;
    zoom = 11;
    markers: Marker[] = [];
    bounds: LatLngBounds;
    servicerQuery = new QueryModel({
        limit: 1000,
        status: `${UserStatus.ACTIVE}`,
        // hasIncidentCollectionTime: 1
    });
    locationQuery = new LocationQueryModel({
        limit: 1000,
        state: true,
        fields: 'servicerId,state,location,updatedAt,bearing,vehicleTypeId'
    });
    vehicleTypes = {};
    statisticQueryModel = new DashboardStatisticsQueryModel({ limit: 60 });
    servicerQueryModel = new DashboardStatisticsQueryModel({ limit: 15 });
    servicerStateQueryModel = new DashboardStatisticsQueryModel();
    servicerGroupPaging = new PagingModel<GroupServicer>();
    group$;
    currentGroup$;
    teams: TeamServicer;
    statistic$;
    statisticLoading$;
    totalServicerState$;
    visibleTotalCollectionDebt: boolean = false;
    visibleOrdersList: boolean = false;

    loadServicerFirst: boolean = true;
    applyFilter: boolean = false;
    servicersData$;
    servicerLimitScroll: number = 15;
    loadingServicer$;
    loadingServicer: boolean = false;
    hasMore$;
    hasMore: boolean = true;
    toDelay: number = -1;
    toTrackLoadStatistic: number = -1;
    isFetching: boolean | number = -1;
    ignoreMapChange: number = -1;
    toignoreServicerDataChange: number = -1;
    isInfoWindowChange: boolean = false;
    ignoreServicerDataChange: boolean = false;
    servicers: { [index: string]: Servicer } = {};
    collectionDebtWallets = {};
    selectedLocation = null;
    locations: ServicerLocationModel[] = [];
    cacheServicers: { [index: string]: Servicer } = {};
    doingServicers = [];
    orderQuery = new QueryModel({
        limit: 1000,
        status: `${OrderStatus.InProgress},${OrderStatus.Accepted},${OrderStatus.Incident},${OrderStatus.ProcessingIncident},${OrderStatus.Return}`,
        fields: '_id,servicerId,code,status'
    });
    servicer: Servicer;
    servicerChosed: Servicer;
    currentState: string = 'online';
    processingStarted: boolean = false;
    delayToFetch: number = 1;
    incidentOrders: { [servicerId: string]: OrderModel[] } = {};
    processingOrders: { [servicerId: string]: OrderModel[] } = {};

    constructor(
        private servicerService: ServicerService,
        private vehicleService: VehicleService,
        private orderService: OrderService,
        private walletService: WalletService,
        private locationService: LocationService,
        private store: Store<{}>
    ) {

    }

    ngOnDestroy() {
        this.loadServicerFirst = true;
        this.processingStarted = false;
        clearInterval(this.toTrackLoadStatistic);
    }

    async ngOnInit() {
        this.group$ = this.store.select(selectServicerGroups)
            .pipe(map(group => group.data));
        this.statistic$ = this.store.select(getReportState).pipe(
            map(state => state.data)
        );
        this.statisticLoading$ = this.store.select(selectStatisticLoading);
        this.totalServicerState$ = this.store.select(selectServicerState);

        this.hasMore$ = this.store.select(selectServicerHasMore);
        this.loadingServicer$ = this.store.select(selectServicerLoading);
        this.servicersData$ = this.store.select(selectServicerData);
        this.currentGroup$ = this.store.select(selectServicerCurrentGroup);
        this.statisticLoading$.subscribe(val => {
            if (!val) {
                this.applyFilter = false;
            }
        });
        this.loadingServicer$.subscribe(val => {
            this.loadingServicer = val;
        });
        this.hasMore$.subscribe(hasMore => {
            this.hasMore = hasMore;
        });
        this.store.dispatch(
            new servicerAction.LoadGroupServicers(
                new QueryModel({ limit: 1000 })
            )
        );

        const vehicleTypes = await this.vehicleService.getVehicleTypes(false);
        this.vehicleTypes = mapKeys(vehicleTypes, '_id');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(point => {
                this.lat = point.coords.latitude;
                this.lng = point.coords.longitude;
                this.processingStarted = true;
            }, () => {
                this.processingStarted = true;
            });
        } else {
            this.processingStarted = true;
        }

        this.teams = await this.servicerService.getAllTeamServicers();

        this.loadStatistics();
        this.trackLoadStatic();
    }

    trackLoadStatic() {
        if (this.toTrackLoadStatistic) {
            clearInterval(this.toTrackLoadStatistic);
        }
        this.toTrackLoadStatistic = <any>setInterval(() => {
            this.statisticQueryModel.servicerCodes = '';
            this.store.dispatch(new LoadStatistics(this.statisticQueryModel));
        }, 10000);

    }

    loadTeamsByGroup($event) {
        this.statisticQueryModel.teamId = null;
        this.store.dispatch(new LoadTeamsByGroup($event));
    }

    loadTotalServicer() {
        this.store.dispatch(new LoadTotalServicersState(this.servicerStateQueryModel));
    }

    filterStatistic() {
        this.delayToFetch = 0;
        this.applyFilter = true;
        this.trackLoadStatic();
        this.loadStatistics();
        this.currentState = this.statisticQueryModel.state;
    }

    async loadStatistics() {
        this.servicer = new Servicer();
        this.selectedLocation = null;
        if (this.statisticQueryModel.servicerCodes) {
            const servicerFromCode = await this.servicerService.getServicers(new QueryModel({ code: this.statisticQueryModel.servicerCodes }));
            if (servicerFromCode.data.length) {
                this.servicerChosed = servicerFromCode.data[0];
                this.updateServicerLocation(this.servicerChosed._id, 'servicerChosed');
                this.servicer = new Servicer();
            }
        } else {
            this.servicerQueryModel = cloneDeep(this.statisticQueryModel);
            this.servicerStateQueryModel = cloneDeep(this.statisticQueryModel);
            this.servicerQueryModel.limit = this.servicerLimitScroll;
            this.store.dispatch(new LoadStatistics(this.statisticQueryModel));
            this.loadServicerOnMap();
        }

    }

    mapLoaded() {
        this.isFetching = false;
    }

    boundsChange(bounds) {
        this.bounds = bounds;
        if (this.statisticQueryModel.servicerCodes) {
            this.statisticQueryModel.servicerCodes = '';
        }
    }

    ignoreDataChange() {
        if (this.toignoreServicerDataChange) {
            clearTimeout(this.toignoreServicerDataChange);
        }
        this.ignoreServicerDataChange = true;

        this.toignoreServicerDataChange = <any>setTimeout(() => {
            this.ignoreServicerDataChange = false;

        }, 1000);

    }
    async loadServicerOnMap() {
        if (this.processingStarted
            && (this.isFetching === -1 || this.isInfoWindowChange || this.ignoreServicerDataChange)) {
            return;
        }

        if (this.toDelay) {
            clearTimeout(this.toDelay);
        }
        this.toDelay = <any>setTimeout(async () => {
            if (!this.isFetching) {
                if (!this.delayToFetch) {
                    this.delayToFetch = 1;
                }
                this.isFetching = true;
                this.locationQuery.bounds = this.bounds.toUrlValue();
                if (this.statisticQueryModel.groupId) {
                    this.locationQuery.groupId = this.statisticQueryModel.groupId;
                }
                if (this.statisticQueryModel.teamId) {
                    this.locationQuery.teamId = this.statisticQueryModel.teamId;
                }
                this.locationQuery.state = true;
                if (!this.statisticQueryModel.state) {
                    this.locationQuery.state = null;
                } else {
                    this.locationQuery.state = this.statisticQueryModel.state === 'online';
                }
                this.locations = (await this.locationService.getCurrentLocations(
                    this.locationQuery
                )).data;
                this.loadServicerFirst = true;
                this.getServicerData();
                this.loadTotalServicer();
                const limit = 50;
                if (this.locations.length > 0) {
                    const servicerIds = this.locations.map(
                        x => x.servicerId
                    );
                    const newServicerIds = filter(
                        servicerIds,
                        x => !this.cacheServicers[x]
                    );

                    if (newServicerIds.length > 0) {
                        let index = 0;
                        const newServicerIdsLength = newServicerIds.length;
                        while (index < newServicerIdsLength) {
                            this.servicerQuery.servicerIds = newServicerIds
                                .slice(index, index + limit)
                                .join(',');
                            const servicerPaging = await this.servicerService.getServicers(
                                this.servicerQuery
                            );

                            assignIn(
                                this.cacheServicers,
                                groupBy(
                                    servicerPaging.data,
                                    x => x._id
                                )
                            );
                            index += limit;
                        }
                    }

                    this.servicers = pickBy(
                        this.cacheServicers,
                        (servicers, servicerId) => {
                            return (
                                servicerIds.includes(servicerId) &&
                                (!this.servicerQuery.groupId ||
                                    servicers[0].groupId ===
                                    this.servicerQuery.groupId)
                            );
                        }
                    );

                    if (servicerIds.length > 0) {
                        let wallets = [];
                        let index = 0;
                        let doingServicerIds = [];
                        const servicerIdsLength = servicerIds.length;
                        while (index < servicerIdsLength) {
                            this.orderQuery.servicerIds = servicerIds
                                .slice(index, index + limit)
                                .join(',');
                            const orderPaging = await this.orderService.getOrders(
                                this.orderQuery
                            );
                            forEach(orderPaging.data, orderItem => {
                                if (orderItem.status === OrderStatus.InProgress) {
                                    doingServicerIds = [...doingServicerIds, orderItem.servicerId];
                                }
                                if (this.processingOrders.hasOwnProperty(orderItem.servicerId)) {
                                    this.processingOrders[orderItem.servicerId].push(orderItem);
                                } else {
                                    this.processingOrders[orderItem.servicerId] = [orderItem];
                                }
                            });
                            const indentOrderData = (await this.orderService.getOrders(new QueryModel({ fields: this.orderQuery.fields, limit: this.orderQuery.limit, status: OrderStatus.Incident }))).data;
                            _.forEach(indentOrderData, (item) => {
                                if (this.incidentOrders.hasOwnProperty(item.servicerId)) {
                                    this.incidentOrders[item.servicerId].push(item);
                                } else {
                                    this.incidentOrders[item.servicerId] = [item];
                                }
                            });
                            _.forEach(this.processingOrders, (value, key) => {
                                this.processingOrders[key] = _.uniqBy(value, '_id');
                            });
                            _.forEach(this.incidentOrders, (value, key) => {
                                this.incidentOrders[key] = _.uniqBy(value, '_id');
                            });
                            wallets = concat(
                                wallets,
                                (await this.walletService.filter(
                                    new QueryModel({
                                        limit: 1000,
                                        hasCollectionDebt: 1,
                                        userIds: servicerIds
                                            .slice(index, index + limit)
                                            .join(',')
                                    })
                                )).data
                            );
                            index += limit;
                        }
                        this.doingServicers = uniq(doingServicerIds);
                        this.collectionDebtWallets = groupBy(
                            filter(wallets, x => x.collectionDebt > 0),
                            y => y.userId
                        );
                    }
                }
                this.isFetching = false;
            }
        }, 2500 * this.delayToFetch);
    }

    async setSelectedServicer(servicerId: string = null) {
        if (!isEmpty(this.servicers) && this.servicers[servicerId]) {
            this.servicer = this.servicers[servicerId][0];
            this.servicerChosed = new Servicer();
            this.updateServicerLocation(servicerId);
        } else {
            this.servicerChosed = await this.servicerService.get(servicerId);
            this.updateServicerLocation(servicerId, 'servicerChosed');
        }
        this.zoom = 14;
    }

    async updateServicerLocation(servicerId: string = null, servicerField = 'servicer') {
        if (!this[servicerField].location || this[servicerField].location.coordinates) {
            const currentLocation = await this.locationService.getCurrentLocations(new LocationQueryModel({ servicerIds: servicerId }));
            if (currentLocation.data.length && currentLocation.data[0].location) {
                this[servicerField].location = currentLocation.data[0].location;
            }
        }
        if (this[servicerField]) {
            this.selectedLocation = this[servicerField];
        }
        if (this[servicerField].location && this[servicerField].location.latitude) {
            this.lat = this[servicerField].location.latitude;
            this.lng = this[servicerField].location.longitude;
            this.ignoreDataChange();
        }
    }

    afterCloseInfoWindow() {
        this.selectedLocation = null;
    }

    onChangeInfoWindow() {
        if (this.ignoreMapChange) {
            clearTimeout(this.ignoreMapChange);
        }
        this.isInfoWindowChange = true;

        this.ignoreMapChange = <any>setTimeout(() => {
            this.isInfoWindowChange = false;
        }, 2000);
    }

    handleVisibleTotalCollectionDebt(flag = false) {
        this.visibleTotalCollectionDebt = !!flag;
    }

    handleVisibleOrdersList(flag = false) {
        this.statisticQueryModel.page = 1;
        this.visibleOrdersList = !!flag;
    }

    handleShowAcceptedOrders() {
        this.statisticQueryModel.status = OrderStatus.Accepted.toString();
        this.handleVisibleOrdersList(true);
    }

    handleShowIncidentOrders() {
        this.statisticQueryModel.status = `${OrderStatus.Incident},${OrderStatus.ProcessingIncident}`;
        this.handleVisibleOrdersList(true);
    }

    handleShowInProgressOrders() {
        this.statisticQueryModel.status = OrderStatus.InProgress.toString();
        this.handleVisibleOrdersList(true);
    }

    handleShowReturnOrders() {
        this.statisticQueryModel.status = OrderStatus.Return.toString();
        this.handleVisibleOrdersList(true);
    }

    getServicerData() {
        if (this.loadServicerFirst) {
            this.servicerQueryModel.page = 1;
        } else {
            this.servicerQueryModel.page = this.servicerQueryModel.page + 1;
        }
        if (this.bounds && this.bounds.toUrlValue()) {
            this.servicerQueryModel.bounds = this.bounds.toUrlValue();
            this.servicerStateQueryModel.bounds = this.bounds.toUrlValue();
        }
        this.store.dispatch(new GetServicersList(this.servicerQueryModel, this.loadServicerFirst));
        if (this.loadServicerFirst) {
            this.loadServicerFirst = false;
        }
    }

    changeServicerState($event: string = null) {
        this.servicerQueryModel.servicerStatus = $event;
        this.loadServicerFirst = true;
        this.getServicerData();
    }

    onScroll() {
        if (!this.loadingServicer && this.hasMore) {
            this.getServicerData();
        }
    }

    servicerMarker(vehicleId = '', marker = '') {
        if (vehicleId && this.vehicleTypes[vehicleId]) {
            return this.vehicleTypes[vehicleId][marker] ? this.vehicleTypes[vehicleId][marker] : '';
        }
        return null;
    }
}