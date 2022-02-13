export interface Status {
    _id?: string;
    name?: string;
    code?: string;
}

export interface ISelection {
    _id?: string;
    name?: string;
    code?: number;
}

export interface IStringSelection {
    _id?: string;
    name?: string;
    code?: string;
}

export class Selection {
    _id?: string;
    name?: string;
}
