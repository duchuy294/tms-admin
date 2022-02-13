import { ActionEvent } from '@/services/event.bus.service';

export enum ProfileActionTypes {
    verify = '[Profile] Verify Start',
    verifySuccess = '[Profile] Verify Success',
    verifyFail = '[Profile] Verify Fail'
}

export class ProfileStart implements ActionEvent {
    readonly type = ProfileActionTypes.verify;
}

export class ProfileSuccess implements ActionEvent {
    readonly type = ProfileActionTypes.verifySuccess;
}

export class ProfileFaild implements ActionEvent {
    readonly type = ProfileActionTypes.verifyFail;
}


export type ProfileActionEvent = ProfileStart | ProfileSuccess | ProfileFaild;