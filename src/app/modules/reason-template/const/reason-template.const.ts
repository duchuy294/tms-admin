import { ReasonTemplateType } from './reason-template-type.const';

export class ReasonTemplate {
    static readonly types = Object.keys(ReasonTemplateType).map(key => ReasonTemplateType[key]);
}