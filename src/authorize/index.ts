import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {LoginCmp} from './login/login.cmp';
import {RegisterCmp} from './register/register.cmp';

const ROUTES: Routes = [
    {
        path: '',
        children: [
            {path: 'login', component: LoginCmp},
            {path: 'register', component: RegisterCmp}
        ]
    }
]

@NgModule({
    imports: [
        FormsModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        LoginCmp,
        RegisterCmp
    ]
})

export class AuthorizeModule
{
}