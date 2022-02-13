import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OperatorNoteComponent } from './../../../../order/components/operator-note/operator-note.component';
import { OrderModel } from '@/modules/order/models/order.model';
import { Profile } from '@/modules/profile/models/profile.model';
import { SessionService } from '@/modules/utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseOrderDetailInformationComponent } from './warehouse-order-detail-information/warehouse-order-detail-information.component';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'warehouse-order-detail',
  templateUrl: './warehouse-order-detail.component.html',
  styleUrls: ['./warehouse-order-detail.component.less']
})

export class WarehouseOrderDetailComponent implements OnInit {
  @Input() order: OrderModel = null;
  @Output() onChange = new EventEmitter();
  @ViewChild('warehouseOrderOperatorNote') warehouseOrderOperatorNote: OperatorNoteComponent;
  @ViewChild('detailInformation') detailInformation: WarehouseOrderDetailInformationComponent;
  loading: boolean = false;
  visibleNoteForm: boolean = false;
  loadingNoteForm: boolean = false;
  visiblePoints: boolean = false;
  loadingPoints: boolean = false;
  actionFormVisible: boolean = false;
  actionType: string;
  currentUser: Profile = null;
  orderId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    public sessionService: SessionService,
  ) { }

  async ngOnInit() {
    await this.getCurrentUser();
  }

  handleVisible(flag = true) {
    this.visibleNoteForm = !!flag;
    if (!flag) {
      this.warehouseOrderOperatorNote.reset();
    }
  }

  handleLoading(flag = true) {
    this.loadingNoteForm = !!flag;
  }

  handleVisiblePoints(flag = true) {
    this.visiblePoints = !!flag;
  }

  submit($event) {
    if ($event.success) {
      this.handleVisible(false);
      this.messageService.success(
        this.translateService.instant('warehouse.warehouse-order.successful-edit-operator')
      );
      if (this.order) {
        this.order.adminNote = $event.data;
      }
    } else {
      this.messageService.error('');
    }
    this.handleLoading(false);
  }

  displayNoteAdmin() {
    this.handleVisible(true);
  }

  displayPoints() {
    this.handleVisiblePoints(true);
  }

  handleActionFormVisible(flag = true) {
    this.actionFormVisible = !!flag;
  }

  setActionType(type: string = null) {
    this.actionType = type;
    this.handleActionFormVisible();
  }

  handleAfterAction() {
    this.onChange.emit();
    this.detailInformation.loadHistory();
  }
  async getCurrentUser() {
    this.currentUser = this.sessionService.getCurrentUser();
  }
}
