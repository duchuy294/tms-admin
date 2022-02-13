import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EventBusService } from '@/services/event.bus.service';
import { Injectable, Injector } from '@angular/core';
import { NotificationType } from '../constants/notification-type.enum';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
    NotificationActionTypes, ReceiveNotificationSuccess, ReceiveNotificationFail, ReceiveMessengerNotification, ReceiveNotification,
} from '../actions/notitication.actions';

@Injectable()
export class OrderNotificationEffects {
    @Effect()
    orderNotification$ = this.actions$.pipe(
        ofType(NotificationActionTypes.receiveNotification),
        tap((v: any) => {
            let notificationLink = '';
            const targetLink = '_blank';
            switch (v.payload.notificationType) {
                case NotificationType.ORDER:
                case NotificationType.INCIDENT_ORDER:
                case NotificationType.MESSENGER:
                    notificationLink = `#/pages/order/${(v.payload.data.orderId || v.payload.data._id || '')}`;
                    break;
                case NotificationType.RESPONSE:
                    notificationLink = '#/pages/marketing/response';
                    break;
                case NotificationType.WALLET:
                    notificationLink = '#/pages/finance/digital-wallet';
                    break;
                case NotificationType.WAREHOUSE:
                    notificationLink = `#/pages/warehouse/detail/${v.payload.data.warehouseId || ''}`;
                    break;
                case NotificationType.CONTACT:
                    notificationLink = `#/pages/order/contact/${v.payload.data._id || ''}`;
                    break;
            }

            if (v.payload.notificationType === 'messenger') {
                this.eventBusService.emit(new ReceiveMessengerNotification(v.payload));
            } else {
                this.eventBusService.emit(new ReceiveNotification(v.payload));
            }

            const notifyTemplate = `<div class='notification__template'>
                <div class='notification-modal__image'>
                    <img src='assets/icon/app.png' />
                </div>
                <div class='notification-modal__content'>
                    <h3 class='notification-modal__title'>${v.payload.notification.title}</h3>
                    <p>
                        ${v.payload.notification.body}
                    </p>
                    ${v.payload.notificationType === 'messenger' ? `<p><b>${this.translateService.instant('common.orderCode')}:</b> ${v.payload.data.orderCode}</p>` : ''}
                    ${notificationLink ? `<a href='${notificationLink}${v.payload.notificationType === 'messenger' ? `/${v.payload.data.conversationType}` : ''}' ${targetLink} class='notification-modal__viewmore'>${this.translateService.instant('notification.view-detail')}</a>` : ''}
                </div>
            </div>`;
            this.notify.blank('', notifyTemplate);
        }),
        switchMap(v => of(new ReceiveNotificationSuccess(v.payload))),
        catchError(err => of(new ReceiveNotificationFail(err)))
    );

    get notify(): NzNotificationService {
        return this.injector.get(NzNotificationService);
    }

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private eventBusService: EventBusService,
        private translateService: TranslateService
    ) { }
}
