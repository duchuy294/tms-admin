import { Action } from '@ngrx/store';

export class ActionPayload implements Action {
  public type;
  constructor(public payload, public args?: any) { }
}