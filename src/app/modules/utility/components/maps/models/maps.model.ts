export interface Marker {
    lat: number;
    lng: number;
    label?: string;
    address?: string;
    draggable?: boolean;
}

export interface Direction {
    origin: { lat: number; lng: number; };
    destination: { lat: number; lng: number; };
}

export interface RenderOptions {
    polylineOptions?: PolylineOptions;
}

export interface PolylineOptions {
    strokeColor?: string;
    strokeOpacity?: string;
    strokeWeight?: string;
}

export interface DistanceMatrix {
    distance?: number;
    duration?: string;
}
