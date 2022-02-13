import * as _ from 'lodash';

export class MAPSSETTINGS {
    static readonly RENDER_OPTIONS = {
        polylineOptions: {
            strokeColor: '#f00',
            strokeOpacity: 0.6,
            strokeWeight: 5,
        },
        markerOptions: {
            zIndex: 1
        },
        suppressMarkers: true,
        preserveViewport: true
    };

    static readonly RENDER_RED = _.assignIn(_.clone(MAPSSETTINGS.RENDER_OPTIONS), {
        polylineOptions: {
            strokeColor: '#f00',
        }
    });

    static readonly RENDER_GREEN = _.assignIn(_.clone(MAPSSETTINGS.RENDER_OPTIONS), {
        polylineOptions: {
            strokeColor: '#0f0',
        }
    });
}
