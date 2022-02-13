import { DistanceMatrix, Marker } from './models/maps.model';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';
import { LatLngBounds } from '@agm/core/services/google-maps-types';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';


declare var google: any;

@Injectable()
export class MapsService {
    private geocoder: any;

    constructor(
        private mapLoader: MapsAPILoader,
        private googleMapsAPIWrapper: GoogleMapsAPIWrapper
    ) { }

    private init() {
        this.geocoder = new google.maps.Geocoder();
    }

    private waitForMapsToLoad(): Observable<boolean> {
        if (!this.geocoder) {
            return fromPromise(this.mapLoader.load())
                .pipe(
                    tap(() => this.init()),
                    map(() => true)
                );
        }
        return of(true);
    }

    public getLocation(latlng: { lat: number, lng: number }): Promise<google.maps.GeocoderResult> {
        return this.waitForMapsToLoad().pipe(
            switchMap(() => {
                return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
                    this.geocoder.geocode({ 'location': latlng }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK && results[0]) {
                            resolve(results[0]);
                        } else {
                            reject();
                        }
                    });
                });
            })
        ).toPromise();
    }

    public async getDistance(start: Marker, end: Marker): Promise<DistanceMatrix> {
        const origin = new google.maps.LatLng(start.lat, start.lng);
        const destination = new google.maps.LatLng(end.lat, end.lng);
        const request = {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING
        };

        const response = await this.getDistanceMatrix(request);
        const result = response.rows[0].elements[0];

        return result.status === google.maps.DistanceMatrixElementStatus.ZERO_RESULTS ?
            { distance: 0, duration: '' } :
            { distance: parseFloat(result.distance.text.replace(',', '.')), duration: result.duration.text };
    }

    private getDistanceMatrix(data) {
        const service = new google.maps.DistanceMatrixService();
        return new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
            service.getDistanceMatrix(data, (response, status) => {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }

    getBounds(): Promise<LatLngBounds> {
        return this.waitForMapsToLoad().pipe(
            switchMap(() => {
                return new Promise<LatLngBounds>((resolve) => {
                    resolve(new google.maps.LatLngBounds());
                });
            })
        ).toPromise();
    }

    async getMapBounds() {
        const self = this;
        return this.waitForMapsToLoad().pipe(
            switchMap(() => {
                return new Promise<LatLngBounds>((resolve) => {
                    resolve(self.googleMapsAPIWrapper.getBounds());
                });
            })
        ).toPromise();
    }
}

