import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Profile } from '@/modules/profile/models/profile.model';
import { SessionService } from '@/modules/utility/services/session.service';
import { WarehouseContactDetailInformationComponent } from './warehouse-contact-detail-information/warehouse-contact-detail-information.component';
import { WarehouseContactModel } from '@/modules/warehouse/models/warehouse-contact.model';
import { WarehouseContactService } from '@/modules/warehouse/services/warehouse-contact.service';

@Component({
  selector: 'warehouse-contact-detail',
  templateUrl: './warehouse-contact-detail.component.html',
  styleUrls: ['./warehouse-contact-detail.component.less']
})
export class WarehouseContactDetailComponent implements OnInit, OnDestroy {
  @ViewChild('information') information: WarehouseContactDetailInformationComponent;
  public contact: WarehouseContactModel = null;
  contactId;
  contactChangeRef$: any;
  loading: boolean = false;
  visibleNoteForm: boolean = false;
  loadingNoteForm: boolean = false;
  currentUser: Profile = null;

  constructor(
    public contactService: WarehouseContactService,
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    public sessionService: SessionService,
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(() => {
      this._updateContact();
    });

    await this.getCurrentUser();
    this.contactChangeRef$ = this.db.database.ref('order');
    this.contactChangeRef$.on('child_changed', this.contactChange.bind(this));
    this.contactChangeRef$.on('child_removed', this.contactChange.bind(this));
  }

  ngOnDestroy() {
    if (this.contactChangeRef$) {
      this.contactChangeRef$.off('child_changed', this.contactChange.bind(this));
      this.contactChangeRef$.off('child_removed', this.contactChange.bind(this));
    }
  }

  async contactChange(data) {
    if (this.contact._id === data.key) {
      await this._updateContact();
    }
  }

  async _updateContact() {
    this.loading = true;
    this.contactId = this.route.snapshot.paramMap.get('id');
    this.contact = await this.contactService.get(this.contactId);
    this.loading = false;
  }

  async reloadData() {
    await this._updateContact();
    await this.information.loadHistory();
  }
  async getCurrentUser() {
    this.currentUser = this.sessionService.getCurrentUser();
  }
}