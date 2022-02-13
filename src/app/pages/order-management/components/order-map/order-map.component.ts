import * as _ from 'lodash';
import { Component, Input, OnChanges } from '@angular/core';
import { Direction, Marker } from 'app/modules/utility/components/maps/models/maps.model';
import { LatLngBounds } from '@agm/core/services/google-maps-types';
import { LocationModel } from 'app/models/location.model';
import { LocationService } from '../../../../modules/location/services/location.service';
import { MapsAPILoader } from '@agm/core';
import { MapsService } from 'app/modules/utility/components/maps/maps.service';
import { MAPSSETTINGS } from 'app/modules/utility/components/maps/models/maps.const';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderStatus } from 'app/constants/OrderStatus';
import { OrderType } from 'app/modules/order/constants/OrderType';
import { PointModel } from 'app/modules/order/models/point.model';
import { PointStatus } from 'app/modules/order/constants/PointStatus';
import { QueryModel } from 'app/models/query.model';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
declare var google: any;

@Component({
    selector: 'order-map',
    templateUrl: './order-map.component.html',
    styleUrls: ['./order-map.component.less']
})
export class OrderMapComponent implements OnChanges {
    @Input() base: Marker;
    current: Marker;
    public servicer = new Servicer();
    @Input() completed: Marker[];
    @Input() processing: Marker[];
    @Input() order: OrderModel;
    @Input() travelMode?: google.maps.TravelMode;
    @Input() info?: { _id?: string; fullName?: string; avatar?: string };
    @Input() height?: string;
    locations: LocationModel[] = [];
    completedPoints: PointModel[] = [];
    processingPoints: PointModel[] = [];
    zoom = 8;
    markers: Marker[] = [];
    fitBounds: LatLngBounds;
    processingDirection = [];
    locationQuery = new QueryModel();
    renderRedOptions = MAPSSETTINGS.RENDER_RED;
    renderGreenOptions = MAPSSETTINGS.RENDER_GREEN;
    statusServicerMarker: boolean = true;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private mapsService: MapsService,
        private servicerService: ServicerService,
        private locationService: LocationService
    ) {
        localStorage.removeItem('firebase:previous_websocket_failure');
    }

    async ngOnChanges() {
        this.updateMarkers();
        if (this.info) {
            await this.servicerService.registerLocation(
                this.info._id,
                this.getCurrentLocation.bind(this)
            );
        }
        this.mapsAPILoader.load().then(async () => {
            await this.loadMaps();
            await this.updatefitBounds();
        });

        if (
            [
                OrderStatus.Accepted,
                OrderStatus.InProgress,
                OrderStatus.Finished,
                OrderStatus.FinishedWithReturn
            ].includes(this.order.status)
        ) {
            this.locationQuery.servicerId = this.order.servicerId;
            this.locationQuery.startTime = this.order.acceptedAt;
            if (this.order.status === OrderStatus.Finished || this.order.status === OrderStatus.FinishedWithReturn) {
                this.locationQuery.endTime = this.order.finishedAt;
            }
            const partnerLocations = (await this.locationService.get(this.locationQuery));
            if (!_.isEmpty(partnerLocations) && partnerLocations.hasOwnProperty('data')) {
                this.locations = partnerLocations.data;
            }
            this.locations = this.locations ? this.locations : [];
        }

        if (this.info) {
            this.servicer = await this.servicerService.get(this.info._id);
        }
    }

    async getCurrentLocation(location) {
        if (location) {
            this.current = location as Marker;
            if (this.order.status !== OrderStatus.Finished && this.order.status !== OrderStatus.FinishedWithReturn) {
                this.locations.push(location);
                await this.loadMaps();
                await this.updatefitBounds();
            }
        }
    }

    async loadMaps() {
        const processingPoints = _.filter(
            this.order.detail.points,
            point => point.status === PointStatus.NEW || point.status === PointStatus.IN_PROCESSING
        );
        const processingLocations = processingPoints.map(
            point => point.location as Marker
        );
        this.updateDirection(processingLocations);
    }

    async updatefitBounds() {
        this.fitBounds = await this.mapsService.getBounds();
        this.markers.forEach(item => {
            const latlng = new google.maps.LatLng(item.lat, item.lng);
            if (latlng) {
                this.fitBounds.extend(latlng);
            }
        });
        if (this.current) {
            this.fitBounds.extend(this.current);
        }
    }

    reloadMap() {
        this.updateMarkers();
        this.mapsAPILoader.load().then(async () => {
            await this.loadMaps();
            await this.updatefitBounds();
        });
    }

    private updateMarkers() {
        this.markers = [];
        for (let index = 0; index < this.order.detail.points.length; index++) {
            const point = this.order.detail.points[index];
            const marker = _.cloneDeep(point.location) as Marker;
            if (
                [OrderType.DELIVERY, OrderType.DELIVERY_INSTALL].includes(
                    this.order.serviceType
                )
            ) {
                marker.label = index === 0 ? 'P' : index.toString();
            } else {
                marker.label = index.toString();
            }
            this.markers.push(marker);
        }
    }

    private updateDirection(items: Marker[]) {
        while (this.processingDirection.length > 0) {
            this.processingDirection.pop();
        }
        if (items.length > 0 && this.current) {
            this.processingDirection.push({
                origin: this.current,
                destination: items[0]
            });
        }
        for (let i = 0; i < items.length - 1; i++) {
            const item: Direction = {
                origin: items[i],
                destination: items[i + 1]
            };
            this.processingDirection.push(item);
        }
    }
    changeStatus() {
        this.statusServicerMarker = !this.statusServicerMarker;
    }
    isOpenChange($event) {
        this.statusServicerMarker = $event;
    }
}
