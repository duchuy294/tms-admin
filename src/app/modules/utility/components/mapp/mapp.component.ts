import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';

@Component({
    selector: 'mapp',
    templateUrl: './mapp.component.html',
    styleUrls: ['./mapp.component.less']
})
export class MappComponent {
    zoom = 13;
    lat = 10.777453;
    lng = 106.699174;
    centerLat: number = 10.777453;
    centerLng: number = 106.699174;
    @Input() isDraggable: boolean = false;
    mapAddress: any;
    interval: any;
    currentCenter: any;
    map = null;
    tO = -1;
    loading: boolean = false;

    @Input() showButton: boolean = false;
    @Input()
    set location(value) {
        if (value) {
            this.lat = value.lat || value.latitude;
            this.lng = value.lng || value.lngitude;
        }
    }

    @Output() center = new EventEmitter();

    getAddress(lat: number, lng: number) {
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, lng);
        const request = { location: latlng };
        return new Promise(resolve => {
            geocoder.geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const result = results[0];
                    if (result !== null) {
                        resolve(result.formatted_address);
                    } else {
                        resolve('No address available!');
                    }
                }
            });
        });
    }

    mapReady(map) {
        const instance = this;
        this.map = map;
        this.map.addListener('dragend', function () {
            const center = { lat: this.center.lat(), lng: this.center.lng() };
            instance.centerChange(center);
        });
    }

    centerChange(center?) {
        if (!this.loading) {
            clearTimeout(this.tO);
            this.loading = true;
            this.tO = <any>setTimeout(async () => {

                this.centerLat = Number(center['lat']);
                this.centerLng = Number(center['lng']);

                this.mapAddress = await this.getAddress(
                    this.centerLat,
                    this.centerLng
                );
                this.center.emit({
                    lat: this.centerLat,
                    lng: this.centerLng,
                    mapAddress: this.mapAddress
                });
                this.loading = false;
            }, 800);
        }
    }

    toggleDraggableFunction() {
        this.isDraggable = !this.isDraggable;
    }
}
