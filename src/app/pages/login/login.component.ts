import { CommonHelper } from '@/utility/common/common.helper';
import { Component, ViewChild } from '@angular/core';
import { EventBusService } from '@/services/event.bus.service';
import { LoginFaild, LoginSuccess } from './actions';
import { LoginService } from './services/login.service';
import { LoginUser } from './models/LoginUser';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.less']
})
export class LoginComponent {
    public user: LoginUser = new LoginUser();
    public submitted: boolean = false;
    public isLoginSuccessful = null;
    @ViewChild('loginForm') loginForm: NgForm;

    constructor(private loginService: LoginService, private eventBusService: EventBusService) {
        this.loginService.checkLoggedIn();
    }

    public async onSubmit() {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.isLoginSuccessful = await this.loginService.login(this.user);
            this.eventBusService.emit(this.isLoginSuccessful ? new LoginSuccess() : new LoginFaild());
            localStorage.setItem('currentUser', this.loginForm.value.phone);
        } else {
            CommonHelper.validateForm(this.loginForm);
        }
    }
}
