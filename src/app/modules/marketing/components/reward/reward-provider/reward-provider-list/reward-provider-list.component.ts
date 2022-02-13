import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from 'app/models/query.model';
import { RewardProviderFilterComponent } from './../reward-provider-filter/reward-provider-filter.component';
import { RewardProviderGridComponent } from './../reward-provider-grid/reward-provider-grid.component';
import { RewardProviderModel } from 'app/modules/marketing/models/reward-provider.model';
import { RewardProviderService } from 'app/modules/marketing/services/reward-provider.service';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'reward-provider-list',
    templateUrl: 'reward-provider-list.component.html'
})
export class RewardProviderListComponent {
    displayFilter: boolean = false;
    @ViewChild('rewardProviderFilter')
    rewardProviderFilter: RewardProviderFilterComponent;
    @ViewChild('rewardProviderGrid')
    rewardProviderGrid: RewardProviderGridComponent;
    createModifyModalVisible = false;
    modifyingModel = new RewardProviderModel();
    model: RewardProviderModel;
    rewardQuery: QueryModel;
    visibleModal = false;
    constructor(
        public rewardProviderService: RewardProviderService,
        public ngbModal: NgbModal,
        private messageService: NzMessageService,
        public translateService: TranslateService,
        public modalService: NzModalService) { }

    async search(query: QueryModel) {
        this.rewardProviderGrid.loadData(query);
    }

    confirmDelete(model: RewardProviderModel) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(model),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(model: RewardProviderModel) {
        model = _.cloneDeep(model);
        model.status = Status.DELETED;
        const response = await this.rewardProviderService.update(model);

        if (response.errorCode === 0) {
            this.messageService.success(
                this.translateService.instant('common.sucessful-delete')
            );
            await this.rewardProviderGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.unsucessful-delete')
            );
        }
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit(loading = false) {
        if (!loading) {
            this.rewardProviderGrid.loadData();
        } else {
            const queryModal = new QueryModel();
            this.rewardProviderGrid.loadData(queryModal);
            this.rewardProviderFilter.reset();
        }
    }
    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    viewRewardModal(provider: RewardProviderModel) {
        this.rewardQuery = new QueryModel({ rewardProviderId: provider._id });
        this.visibleModal = true;
        this.model = provider;
    }

    handleVisible(flag) {
        this.visibleModal = flag;
    }

    async editModal(id: string = null) {
        this.modifyingModel = await this.rewardProviderService.get(id);
        this.handleModelVisible(true);
    }
    // public searchValue: string;
    // public displayFilter: boolean = false;
    // public rewardProviderPaging: PagingModel<RewardProviderModel> = new PagingModel<RewardProviderModel>();
    // public query: QueryModel = new QueryModel();
    // public model: RewardProviderModel;
    // public rewardQuery: QueryModel;
    // public visibleModal = false;
    // public actions = [
    //     new GridAction({ name: 'button.remove', perform: this.delete.bind(this), visible: (model: RewardProviderModel) => model.status !== Status.DELETED }),
    //     new GridAction({ name: 'button.edit', perform: this.openModalModify.bind(this) }),
    //     new GridAction({ name: 'button.view', perform: this.viewRewardModal.bind(this) })
    // ];

    // constructor(
    //     private service: RewardProviderService,
    //     private modalService: ModalService,
    //     private ngbModal: NgbModal
    // ) { }

    // async ngOnInit() {
    //     await this.loadData();
    // }

    // async search() {
    //     await this.loadData();
    // }

    // async loadData() {
    //     this.rewardProviderPaging = await this.service.filter(this.query);
    // }

    // confirmDelete(model: RewardProviderModel) {
    //     this.modalService.confirm(
    //         { title: 'Xác nhận', message: 'Bạn muốn xóa?' },
    //         () => this.delete(model)
    //     );
    // }

    // async delete(model: RewardProviderModel) {
    //     model = _.cloneDeep(model);
    //     model.status = Status.DELETED;
    //     const response = await this.service.update(new RewardProviderModel(model));
    //     if (response.errorCode === 0) {
    //         await this.loadData();
    //     } else {
    //         this.modalService.warning(response.message);
    //     }
    // }

    // openModalCreate() {
    //     const modal = this.ngbModal.open(RewardProviderModifyComponent, {
    //         size: 'lg'
    //     }).componentInstance as RewardProviderModifyComponent;

    //     modal.updated = this.loadData.bind(this);
    // }

    // openModalModify(model: RewardProviderModel = null) {
    //     const modal = this.ngbModal.open(RewardProviderModifyComponent, { size: 'lg' })
    //         .componentInstance as RewardProviderModifyComponent;
    //     if (model) {
    //         modal.formType = FormType.Edit;
    //     } else {
    //         modal.formType = FormType.Create;
    //         model = new RewardProviderModel();
    //     }
    //     modal.model = _.cloneDeep(model);
    //     modal.currentModel = _.cloneDeep(model);
    //     modal.updated = this.loadData.bind(this);
    // }

    // viewRewardModal(provider: RewardProviderModel) {
    //     this.rewardQuery = new QueryModel({ rewardProviderId: provider._id });
    //     this.visibleModal = true;
    //     this.model = provider;
    // }

    // handleVisible(flag) {
    //     this.visibleModal = flag;
    // }
}