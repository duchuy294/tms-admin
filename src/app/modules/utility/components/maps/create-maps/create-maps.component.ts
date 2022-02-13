import * as _ from 'lodash';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Direction, Marker } from '../models/maps.model';
import { LatLngBounds } from '@agm/core/services/google-maps-types';
import { MapsService } from '../maps.service';
import { MAPSSETTINGS } from '../models/maps.const';

declare var google: any;

@Component({
    selector: 'create-maps',
    templateUrl: './create-maps.component.html',
    styleUrls: ['./create-maps.component.less']
})
export class CreateMapsComponent implements OnInit, OnChanges {
    @Input() base: Marker;
    @Input() current: Marker;
    @Input() processing: Marker[] = [];

    @Input() height?: string;

    zoom = 8;
    lat: number;
    lng: number;
    fitBounds: LatLngBounds;

    markers: Marker[] = [];
    processingDirection = null;
    renderGreenOptions = MAPSSETTINGS.RENDER_GREEN;

    constructor(private mapsService: MapsService) {}

    ngOnInit() {
        this.updateMarkers();
        this.setCurrentPosition();
        this.updateProcessingDirection();
    }

    private setCurrentPosition() {
        this.lat = 10.762622;
        this.lng = 106.660172;
        this.zoom = 12;
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        }
    }

    async ngOnChanges() {
        this.updateMarkers();
        this.updateProcessingDirection();
        await this.updatefitBounds();
    }

    async updatefitBounds() {
        this.fitBounds = await this.mapsService.getBounds();
        this.markers.forEach(item => {
            const latlng = new google.maps.LatLng(item.lat, item.lng);
            this.fitBounds.extend(latlng);
        });
    }

    private updateMarkers() {
        this.base.label = 'P';
        this.markers = [];
        this.markers.push(_.clone(this.base));

        for (let i = 0; i < this.processing.length; i++) {
            const item = this.processing[i];
            item.label = (i + 1).toString();
            this.markers.push(item);
        }
    }

    private updateProcessingDirection() {
        this.processingDirection = null;
        if (
            this.markers.length > 1 &&
            this.markers[0].lat !== undefined &&
            this.markers[1].lat !== undefined
        ) {
            this.processingDirection = this.updateDirection();
        }
    }

    private updateDirection(): Direction[] {
        const result = [];
        for (let i = 0; i < this.markers.length - 1; i++) {
            this.createDirection(this.markers[i], this.markers[i + 1]);
            result.push(
                this.createDirection(this.markers[i], this.markers[i + 1])
            );
        }

        return result;
    }

    private createDirection(first: Marker, second: Marker) {
        const item: Direction = {
            origin: { lat: first.lat, lng: first.lng },
            destination: { lat: second.lat, lng: second.lng }
        };

        return item;
    }
}
