import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({selector: 'c-login', templateUrl: 'login.comp.html', styleUrls: ['login.comp.scss']})
export class LoginComp implements OnInit
{
    constructor()
    {
        this.UserNameCtr = new FormControl('',
        {
            validators: Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
            updateOn: 'change'
        });
        this.PasswordCtr = new FormControl('',
        {
            validators: Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
            updateOn: 'change'
        });

        this.LoginForms = new FormGroup(
        {
            UserName: this.UserNameCtr,
            Password: this.PasswordCtr
        });
    }

    ngOnInit()
    {
        App.ShowToast('hello world');
    }

    Login()
    {
        // console.log('Login.valid:' + this.LoginForms.valid);
    }

    App = window.App;
    LoginForms: FormGroup;
    UserNameCtr: FormControl;
    PasswordCtr: FormControl;
}
