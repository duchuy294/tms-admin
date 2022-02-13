import * as _ from 'lodash';
import { ApiMarketingHttpService } from './api-marketing-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { PromotionCodeModel } from './../models/promotion-code';
import { PromotionPolicyModel } from './../models/promotion-policy';
import { QueryModel } from './../../../models/query.model';

@Injectable()
export class PromotionPolicyService extends BaseService {
  constructor(private apiHttpService: ApiMarketingHttpService) {
    super();
  }


  async getPromotionPolicyFilter(query: QueryModel): Promise<PagingModel<PromotionPolicyModel>> {
    const response = await this.apiHttpService.get(`promotion-policy-filter${query.url()}`);
    return new PagingModel<PromotionPolicyModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getPromotionPolicies(query: QueryModel): Promise<PagingModel<PromotionPolicyModel>> {
    const response = await this.apiHttpService.get(`promotion-policies${query.url()}`);
    return new PagingModel<PromotionPolicyModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getPromotionPolicy(id, query: QueryModel): Promise<PromotionPolicyModel> {
    const response = await this.apiHttpService.get(`promotion-policy/${id}${query.url()}`);
    return new PromotionPolicyModel(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async createPromotionPolicy(model: PromotionPolicyModel) {
    return await this.apiHttpService.post(`promotion-policy`, model);
  }

  async updatePromotionPolicy(model: PromotionPolicyModel) {
    return await this.apiHttpService.put(`promotion-policy/${model._id}`, _.omit(model, ['_id']));
  }

  async getPromotionCodes(query: QueryModel): Promise<PagingModel<PromotionCodeModel>> {
    const response = await this.apiHttpService.get(`promotion-codes${query.url()}`);
    return new PagingModel<PromotionCodeModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getPromotionCodeIds(query: QueryModel): Promise<any> {
    const response = await this.apiHttpService.get(`promotion-code-ids${query.url()}`);
    return (
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getPromotionCode(id, query: QueryModel): Promise<PromotionCodeModel> {
    const response = await this.apiHttpService.get(`promotion-code/${id}${query.url()}`);
    return new PromotionCodeModel(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async createPromotionCode(model: PromotionCodeModel) {
    return await this.apiHttpService.post(`promotion-code`, model);
  }

  async updatePromotionCode(model: PromotionCodeModel) {
    return await this.apiHttpService.put(`promotion-code/${model._id}`, _.omit(model, ['_id']));
  }

  async getTotalPromotionCodeAmount(query: QueryModel) {
    const response = await this.apiHttpService.get(`promotion-codes/total-amount${query.url()}`);
    return response.errorCode === 0 ? response.data : [];
  }
}
