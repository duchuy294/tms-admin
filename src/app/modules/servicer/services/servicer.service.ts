import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { ApiHttpService } from '../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { GroupServicer } from './../models/group-servicer/group-servicer.model';
import { GroupServicerDetail } from './../models/group-servicer/group-servicer-detail.model';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { Servicer } from './../models/servicer/servicer.model';
import { TeamService, TeamServicer } from '../models/team-servicer/team-servicer.model';
import { TeamServicerPage } from './../models/team-servicer/team-servicer.model';


@Injectable({
  providedIn: 'root'
})
export class ServicerService extends BaseService {
    constructor(private apiHttpService: ApiHttpService, private db: AngularFireDatabase) {
        super();
    }

    async getServicers(query: QueryModel) {
        const response = await this.apiHttpService.get(`admin/servicers${query.url()}`);
        return response.errorCode === 0
            ? new PagingModel<Servicer>(response.data)
            : new PagingModel<Servicer>();
    }

    async filter(filter: QueryModel) {
        return this.getServicers(filter);
    }

    async get(id: string) {
        const response = await this.apiHttpService.get(`admin/servicer/${id}`);
        return new Servicer(this.returnObj<Servicer>(response));
    }

    async createServicer(query: Servicer) {
        return await this.apiHttpService.post(`admin/servicer`, query);
    }

    async updateServicer(query: Servicer) {
        return await this.apiHttpService.put(`admin/servicer`, query);
    }

    async deleteServicer(id: string) {
        const response = await this.apiHttpService.delete(
            `admin/servicer/${id}`
        );
        return response.errorCode === 0;
    }

    async getGroupServicers(query = new QueryModel({ limit: 1000 })) {
        const response = await this.apiHttpService.get(
            `admin/servicerGroups${query.url()}`
        );
        return response.errorCode === 0 ? new PagingModel<GroupServicer>(response.data) : new PagingModel<GroupServicer>();
    }

    async getGroupServicer(url: string) {
        const response = await this.apiHttpService.get(
            `admin/servicerGroup${url}`
        );
        return response.errorCode === 0
            ? new GroupServicerDetail(response.data)
            : new GroupServicerDetail();
    }

    async createGroupServicer(name: string) {
        return await this.apiHttpService.post(`admin/servicerGroup`, { name });
    }

    async updateGroupServicer(query: GroupServicerDetail) {
        return await this.apiHttpService.put(`admin/servicerGroup`, _.omit(query, query.omitFields()));
    }

    async deleteGroupServicer(id: string) {
        const response = await this.apiHttpService.delete(
            `admin/servicerGroup/${id}`
        );
        return response.errorCode === 0;
    }

    async deleteServicerOfGroup(id: string) {
        const response = await this.apiHttpService.delete(
            `admin/servicerOfGroup/${id}`
        );
        return response.errorCode === 0;
    }

    async getTeamServicers(query: QueryModel) {
        const response = await this.apiHttpService.get(
            `admin/servicerTeams${query.url()}`
        );

        return response.errorCode === 0
            ? new PagingModel<TeamServicerPage>(response.data)
            : new PagingModel<TeamServicerPage>();
    }

    async getAllTeamServicers() {
        const response = await this.apiHttpService.get(
            `admin/servicerTeams`
        );
        return response.errorCode === 0 && response.data ? response.data.data : [];
    }

    async getTeamServicer(id: string) {
        const response = await this.apiHttpService.get(
            `admin/servicerTeam/${id}`
        );
        return response.errorCode === 0 ? new TeamServicer(response.data) : null;
    }

    async createTeamServicer(query: TeamServicer) {
        return await this.apiHttpService.post(`admin/servicerTeam`, _.omit(query, query.omitFields()));
    }

    async updateTeamServicer(query: TeamServicer) {
        return await this.apiHttpService.put(`admin/servicerTeam`, _.omit(query, query.omitFields()));
    }

    async deleteTeamServicer(id: string) {
        const response = await this.apiHttpService.delete(
            `admin/servicerTeam/${id}`
        );
        return response.errorCode === 0;
    }

    async deleteServicerOfTeam(id: string) {
        const response = await this.apiHttpService.delete(
            `admin/servicerOfTeam/${id}`
        );
        return response.errorCode === 0;
    }

    async getTeamServicerServices(): Promise<TeamService[]> {
        const response = await this.apiHttpService.get(
            `admin/services`
        );

        return this.returnList(response);
    }

    async resetPassword(servicerId: string, password: string) {
        const response = await this.apiHttpService.put(
            `admin/servicer/${servicerId}/password`,
            { password }
        );
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async registerLocation<T>(id: string, callback: (value) => void) {
        this.db.object<T>(`/account/servicer/${id}/location`).valueChanges().subscribe(callback);
    }

    async getStaffs(id: string) {
        const response = await this.apiHttpService.get(
            `admin/staffs/${id}`
        );
        return this.returnList(response);
    }

    async updateLimitOrder(servicerId: string, limitOrder: number) {
        const response = await this.apiHttpService.put(
            `admin/servicer/${servicerId}/limit-order`,
            { limitOrder }
        );
        return this.returnSuccess(response);
    }
}
