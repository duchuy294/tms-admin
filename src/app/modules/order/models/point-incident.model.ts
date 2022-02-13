export interface IIncident {
    title?: string;
    type?: string;
    detail?: string;
    images?: string[];
    status: number;
    processId?: string;
}