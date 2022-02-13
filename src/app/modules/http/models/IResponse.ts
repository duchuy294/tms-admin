import { IError } from './IError';

export interface IResponse {
    data: any | IError;
    message: string;
    errorCode: number;
    status?: number;
    statistic?: any | IError;
}
