import { ActionEvent } from '@/services/event.bus.service';

export enum LoginActionTypes {
    login = '[Login] Start',
    loginSuccess = '[Login] Success',
    loginFail = '[Login] Fail'
}

export enum LogoutActionTypes {
    logout = '[Logout] Start',
    logoutSuccess = '[Logout] Success',
    logoutFail = '[Logout] Fail'
}

export class LoginStart implements ActionEvent {
    readonly type = LoginActionTypes.login;
}

export class LoginSuccess implements ActionEvent {
    readonly type = LoginActionTypes.loginSuccess;
}

export class LoginFaild implements ActionEvent {
    readonly type = LoginActionTypes.loginFail;
}

export class LogoutStart implements ActionEvent {
  readonly type = LogoutActionTypes.logout;
}

export class LogoutSuccess implements ActionEvent {
  readonly type = LogoutActionTypes.logoutSuccess;
}

export class LogoutFail implements ActionEvent {
  readonly type = LogoutActionTypes.logoutFail;
}


export type LoginActionEvent = LoginStart | LoginSuccess | LoginFaild;
export type LogoutActionEvent = LogoutStart | LogoutSuccess | LogoutFail;