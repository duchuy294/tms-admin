import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormGroup, NgForm } from '@angular/forms';
import { isArray } from 'lodash';

export class CommonHelper {
    public static FormatMoneyNumber(
        moneyNumber: number,
        currency: string = 'VND'
    ) {
        const moneyNumberText = moneyNumber ? moneyNumber.toString() : '0';
        return `${moneyNumberText.replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g,
            '$1,'
        )} ${currency}`;
    }

    public static validateForm(form: NgForm | FormGroup) {
        for (const key of Object.keys(form.controls)) {
            form.controls[key].markAsDirty();
            form.controls[key].updateValueAndValidity();
        }
    }

    public static resetForm(form: NgForm, model?: any) {
        if (model) {
            form.reset(model);
        }
        for (const key of Object.keys(form.controls)) {
            form.controls[key].markAsPristine();
            form.controls[key].markAsUntouched();
            form.controls[key].updateValueAndValidity();
        }
    }

    public static toBoolean(value: boolean | string) {
        return coerceBooleanProperty(value);
    }

    public static delay(ms: number) {
        return new Promise(resolve => {
            setTimeout(() => resolve(ms), ms);
        });
    }

    public static errorMessage(response, alternative = '') {
        return response.message || alternative;
    }

    public static parseErrorMessage(message: string | [{ field: string, message: string }]) {
        const messages = [];
        if (isArray(message)) {
            message.forEach(val => {
                messages.push(`<li>${val.field}: ${val.message}</li>`);
            });
            return `<ul class='error-list'>${messages.join('')}</ul>`;
        }
        return message;
    }

    public static parseS2N(value: string | number) {
        if (typeof value === 'number') {
            return value;
        }
        return parseInt(value.replace(/[,\.]/g, ''), 10);
    }
}
