import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from '@/modules/user/services/user-level.service';

@Component({
    selector: 'user-level',
    templateUrl: './user-level.component.html'
})
export class UserLevelComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    modelQuery = new QueryModel();
    loading: boolean = false;
    pageSize: number = 15;
    pageIndex: number = 1;
    public tableData = new PagingModel<UserLevelModel>();
    visibleModal: boolean = false;
    userLevel: UserLevelModel = new UserLevelModel();
    checked: boolean = true;

    @Input()
    set model(value: QueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }
    constructor(
        private userLevelService: UserLevelService,
        private messageService: NzMessageService,
        private modalService: NzModalService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    loadDataByPage($event = 1) {
        this.modelQuery.page = $event;
        this.loadData();
    }

    loadDataByPageSize($event = 20) {
        this.modelQuery.limit = $event;
        this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.userLevelService.getUserLevels(
            this.modelQuery
        );
        this.loading = false;
    }

    onUpdate() {
        this.loadData();
    }

    addUserLevel() {
        this.visibleModal = true;
    }

    async onEdit(userLevelId: string = null) {
        this.userLevel = await this.userLevelService.get(userLevelId);
        this.visibleModal = true;
    }

    async confirmDelete(userLevelId: string = null) {
        const response = await this.userLevelService.delete(userLevelId);
        if (response) {
            this.loadData();
        }
        this.messageService[response ? 'success' : 'error'](
            `Xoá cấp thành viên ${response ? 'thành công' : 'thất bại'}`
        );
    }

    async confirmDefault(userLevelId: string = null) {
        const userLevel = await this.userLevelService.get(userLevelId);
        if (userLevel) {
            userLevel.default = true;
            const response = await this.userLevelService.update(
                userLevel
            );
            if (response) {
                this.loadData();
            }
            this.messageService[
                response.success ? 'success' : 'error'
            ](
                CommonHelper.errorMessage(
                    response,
                    `Thiết lập mặc định ${
                    response.success ? 'thành công' : 'thất bại'
                    }`
                )
            );
        } else {
            this.messageService.error('Cấp thành viên không tồn tại');
        }
    }

    onDelete(userLevelId: string = null) {
        this.modalService.confirm({
            nzTitle: 'Bạn có chắc là muốn xoá?',
            nzOkText: 'Xoá',
            nzOnOk: () => this.confirmDelete(userLevelId),
            nzCancelText: 'Huỷ'
        });
    }

    onSetDefault(userLevelId: string = null) {
        this.modalService.confirm({
            nzTitle: 'Xác nhận mặc định',
            nzContent: 'Bạn có xác định chọn cấp khách hàng này là mặc định',
            nzOkText: 'Xác nhận',
            nzOnOk: () => this.confirmDefault(userLevelId),
            nzCancelText: 'Huỷ'
        });
    }
}
