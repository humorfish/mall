import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, NgForm} from '@angular/forms';

@Component({selector: 'c-login', templateUrl: 'login.comp.html', styleUrls: ['login.comp.scss']})
export class LoginComp implements OnInit
{
    constructor()
    {
    }

    ngOnInit()
    {
    }

    OnSubmit(f: NgForm)
    {
        console.log(f.value);
        console.log(f.valid);
    }

}
