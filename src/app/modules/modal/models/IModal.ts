import { ModalType } from '../types/ModalType';

export interface IModal {
    title?: string;
    message?: string;
    type?: ModalType;
}