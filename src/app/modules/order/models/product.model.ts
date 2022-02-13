export class ProductModel {
    name = '';
    serialNumber: string = '';
    quantity: number = 1;
    serial: string = '';
    sku: string = '';
    pointId: string = '';
    unit: string = '';
    size?: {
        length?: number,
        width?: number,
        height?: number,
        volume?: number
    } = {}
}