import { CommonHelper } from '@/utility/common/common.helper';
import { IResponse } from '../modules/http/models/IResponse';
import { PagingModel } from './../modules/utility/components/paging/paging.model';

export class BaseService {
    protected returnList<T>(response: IResponse) {
        return (response.errorCode === 0 ? response.data : []) as T[];
    }

    protected returnObj<T>(response: IResponse) {
        return (response.errorCode === 0 ? response.data : {}) as T;
    }

    protected returnSuccess(response: IResponse) {
        return response.errorCode === 0;
    }

    protected responseWithMessage(response: IResponse) {
        return {
            ...response,
            message: CommonHelper.parseErrorMessage(response.message)
        };
    }

    public parseErrorData<T>(data: { field: string; message: string }[]) {
        const errors = {};
        data.forEach(item => {
            errors[item.field] = item.message;
        });

        return errors as T;
    }

    public trimData(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string' && data[key]) {
                    data[key] = data[key].trim();
                } else if (typeof data[key] === 'object') {
                    data[key] = this.trimData(data[key]);
                }
            }
        }

        return data;
    }

    public verifyPageQueryModel<T>(model: PagingModel<T>, modelQuery) {
        modelQuery.page = (model.page > model['pages']) ? model['pages'] : modelQuery.page;
        return { error: model.page > model['pages'], modelQuery };
    }
}
