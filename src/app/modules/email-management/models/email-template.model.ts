export class EmailTemplateModel {
    _id?: string;
    code?: string;
    title?: string = '';
    content?: string = '';
    type?: string = '';
    createdBy?: string = '';
    updatedBy?: string = '';
    status?: number;
}