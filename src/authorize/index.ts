import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {LoginComp} from './login/login.comp';
import {RegisterComp} from './register/register.comp';

const ROUTES: Routes = [
    {
        path: '',
        children: [
            {path: 'login', component: LoginComp},
            {path: 'register', component: RegisterComp}
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [
        LoginComp,
        RegisterComp
    ]
})

export class AuthorizeModule
{
}
