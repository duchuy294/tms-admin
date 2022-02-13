import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ApiAuthHttpService } from '@/modules/http/services/api-auth-http.service';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../modules/theme/services';
import { EventBusService } from '@/services/event.bus.service';
import { GlobalState } from '../global.state';
import { LoginSuccess, LogoutStart } from '@/pages/login/actions';
import { NotificationService } from '@/modules/notification/services/notification.service';
import { ProfileSuccess } from '@/modules/profile/actions';
import { ReceiveNotification } from '@/modules/notification/actions/notitication.actions';
import { SessionService } from '@/utility/services/session.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit, OnDestroy {
    isMenuCollapsed: boolean = false;
    loginEventSubscription: Subscription = null;
    logoutEventSubscription: Subscription = null;
    watchMessages$: Subscription = null;
    watchRequestToken$: Subscription = null;
    isRequestToken: boolean = false;

    constructor(private _state: GlobalState,
        private _imageLoader: BaImageLoaderService,
        private _spinner: BaThemeSpinner,
        private afMessaging: AngularFireMessaging,
        private eventBusService: EventBusService,
        private notificationService: NotificationService,
        private sessionService: SessionService,
        private authService: ApiAuthHttpService,
        private store: Store<{}>) {
        this._loadImages();

        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.reloadFirebaseMessagingServiceWorker();
        this.notificationInit();
    }

    public ngAfterViewInit(): void {
        BaThemePreloader.load().then(() => {
            this._spinner.hide();
        });
    }

    private _loadImages(): void {
        BaThemePreloader.registerLoader(this._imageLoader.load('/assets/img/sky-bg.jpg'));
    }

    private reloadFirebaseMessagingServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(r => {
                if (r[0] && r[0].active && /firebase-messaging-sw.js$/.test(r[0].active.scriptURL)) {
                    r[0].unregister();
                }
            });
        }
    }

    private notificationInit() {
        this.loginEventSubscription = this.eventBusService.on([new ProfileSuccess(), new LoginSuccess()], () => {
            if (this.watchMessages$) {
                this.watchMessages$.unsubscribe();
                this.watchRequestToken$.unsubscribe();
            }
            this.watchRequestToken$ = this.afMessaging.requestToken
                .pipe(tap(() => {
                    this.isRequestToken = true;
                }))
                .subscribe(
                    async (token) => {
                        await this.notificationService.addToken(token);
                        localStorage.setItem('fcmToken', token);
                    },
                    (error) => { console.error(error); }
                );

            this.watchMessages$ = this.afMessaging.messages
                .subscribe((payload: any) => {
                    const { data, notification } = payload;
                    let returnData: any = {};
                    if (data && data.return) {
                        returnData = JSON.parse(data.return);
                    }
                    this.store.dispatch(new ReceiveNotification({
                        action: data.action,
                        notification,
                        data: returnData,
                        notificationId: `${data.type}_${data.action}_${returnData.orderId || returnData._id}`,
                        notificationType: data.type
                    })
                    );
                });

        });

        this.logoutEventSubscription = this.eventBusService.on(new LogoutStart(), async () => {
            const response = await this.authService.post('logout', {});
            if (response && response.errorCode !== -1) {
                localStorage.removeItem('fcmToken');
                this.isRequestToken = false;
                this.sessionService.logout();
            }

        });
    }

    ngOnDestroy() {
        if (this.loginEventSubscription) {
            this.loginEventSubscription.unsubscribe();
        }
        this.logoutEventSubscription.unsubscribe();
    }

}
