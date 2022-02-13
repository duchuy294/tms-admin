import {
    Component,
    ElementRef,
    EventEmitter,
    NgZone,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { MapsService } from '../maps.service';
import { Marker } from '../models/maps.model';

declare var google: any;

@Component({
    selector: 'normal-maps',
    templateUrl: './normal-maps.component.html',
    styleUrls: ['./normal-maps.component.less']
})
export class NormalMapsComponent implements OnInit {
    @Output() location = new EventEmitter<{ lat: number; lng: number }>();
    zoom = 8;
    lat: number;
    lng: number;
    infoWindow: string;
    markers: Marker[] = [];
    dir = null;
    distance: number;
    duration: string;
    position = 0;
    startElementFocus = true;

    @ViewChild('start') public startElement: ElementRef;
    @ViewChild('end') public endElement: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private mapsService: MapsService
    ) {}

    ngOnInit() {
        this.setCurrentPosition();
        this.loadLocation();
    }

    private setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }

    loadLocation() {
        this.mapsAPILoader.load().then(() => {
            this.changeStart();
            this.changeEnd();
        });
    }

    changeStart() {
        const start = new google.maps.places.Autocomplete(
            this.startElement.nativeElement,
            { types: ['address'] }
        );
        start.addListener('place_changed', () => {
            this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = start.getPlace();
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.infoWindow = this.startElement.nativeElement.value;
                this.addMarker(0);
                this.getDirection();
            });
        });
    }

    changeEnd() {
        const end = new google.maps.places.Autocomplete(
            this.endElement.nativeElement,
            { types: ['address'] }
        );
        end.addListener('place_changed', () => {
            this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = end.getPlace();
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.infoWindow = this.endElement.nativeElement.value;
                this.addMarker(1);
                this.getDirection();
            });
        });
    }

    async getDirection() {
        if (this.markers[0] !== undefined && this.markers[1] !== undefined) {
            this.dir = {
                origin: { lat: this.markers[0].lat, lng: this.markers[0].lng },
                destination: {
                    lat: this.markers[1].lat,
                    lng: this.markers[1].lng
                }
            };

            const result = await this.mapsService.getDistance(
                this.markers[0],
                this.markers[1]
            );
            this.distance = result.distance;
            this.duration = result.duration;
        }
    }

    private addMarker(position: number) {
        const item: Marker = {
            lat: this.lat,
            lng: this.lng,
            address: this.infoWindow,
            draggable: true
        };

        if (position === 0) {
            this.addStart(item);
        } else {
            this.addEnd(item);
        }

        this.markers = this.markers;
    }

    private addStart(item: Marker) {
        item.label = 'A';
        if (this.markers.length > 0) {
            this.markers[0] = item;
        } else {
            this.markers.push(item);
        }
    }

    private addEnd(item: Marker) {
        item.label = 'B';
        if (this.markers.length === 2) {
            this.markers[1] = item;
        } else {
            this.markers.push(item);
        }
    }

    async mapClicked($event) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
        await this.getInfoWindow();
        this.addMarker(this.position);
        this.updateInput();
        this.markers = this.markers;
        this.getDirection();
        this.location.emit({ lat: this.lat, lng: this.lng });
    }

    async getInfoWindow() {
        const result = await this.mapsService.getLocation({
            lat: this.lat,
            lng: this.lng
        });
        this.infoWindow = result.formatted_address;
    }

    updateInput() {
        if (this.position === 0) {
            this.endElement.nativeElement.focus();
            this.startElement.nativeElement.value = this.infoWindow;
        } else {
            this.endElement.nativeElement.value = this.infoWindow;
        }
    }
}
