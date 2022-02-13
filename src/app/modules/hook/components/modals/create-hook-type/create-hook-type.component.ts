import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Hook } from './../../../const/hook.const';
import { HookTypeModel } from './../../../models/hook-type.model';
import { HookTypeService } from './../../../services/hook-type.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'create-hook-type',
    templateUrl: './create-hook-type.component.html',
    styleUrls: ['./create-hook-type.component.less']
})

export class CreateHookTypeComponent {
    @ViewChild('hookTypeForm') hookTypeForm: NgForm;

    modelQuery = new HookTypeModel();
    visibleModal: boolean = false;
    types = Hook.types;
    statuses = Hook.statuses;
    loadingModal: boolean = false;

    @Input()
    set model(value: any) {
        this.modelQuery = value;
    }

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set loading(value: boolean) {
        this.loadingModal = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    @Output() handleLoading = new EventEmitter<boolean>();

    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();

    constructor(
        private hookTypeService: HookTypeService
    ) { }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new HookTypeModel();
        CommonHelper.resetForm(this.hookTypeForm);
    }

    async onCreateHookType() {
        this.handleLoadingModal(true);
        this.modelQuery.requiredFields = this.trimRequiredField(this.modelQuery.requiredFields);
        if (this.hookTypeForm.valid) {
            if (_.isEmpty(this.modelQuery.requiredFields) || !this.modelQuery.type) {
                this.handleLoadingModal(false);
                return;
            }
            const response = await this.hookTypeService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.hookTypeForm);
        }
    }

    trimRequiredField(data = []) {
        const result = _.remove(data, field => {
            return (field.trim() !== '');
        });
        return result;
    }
}