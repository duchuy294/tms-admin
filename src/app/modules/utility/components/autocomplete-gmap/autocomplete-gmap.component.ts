import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild
    } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'autocomplete-gmap',
    templateUrl: './autocomplete-gmap.component.html',
    styleUrls: ['./autocomplete-gmap.component.less']
})
export class AutocompleteGmapComponent implements OnInit {
    required: boolean = false;
    address: string = '';
    @Input() appliedBorder: Boolean = false;
    @Output() changePlace = new EventEmitter<any>();
    @Output() inputChange = new EventEmitter<any>();

    placeHolder: string = '';
    @ViewChild('autocomplete')
    public searchElementRef: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(
                this.searchElementRef.nativeElement,
                {
                    types: ['address']
                }
            );
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (
                        place.geometry === undefined ||
                        place.geometry === null
                    ) {
                        return;
                    }

                    this.changePlace.emit(place);
                });
            });
        });
    }

    handleModelChange($event) {
        this.inputChange.emit($event);
    }

    @Input()
    set nzPlaceHolder(value: string) {
        this.placeHolder = value;
    }

    @Input()
    set nzRequired(value: boolean) {
        this.required = value;
    }

    @Input()
    set nzValue(value) {
        this.address = value;
    }
}
