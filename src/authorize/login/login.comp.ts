import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({selector: 'c-login', templateUrl: 'login.comp.html', styleUrls: ['login.comp.scss']})
export class LoginComp implements OnInit
{
    constructor()
    {
    }

    ngOnInit()
    {
        this.LoginForm = new FormGroup(
            {
                UserName: new FormControl()
            }
        );
    }

    LoginForm: FormGroup;
}
