export class EmailAccountModel {
    _id?: string;
    name?: string = '';
    email?: string = '';
    host?: string = '';
    port?: number;
    type?: string = '';
    status?: number;
    createdBy?: string = '';
    updatedBy?: string = '';
}