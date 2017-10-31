import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {HomeCmp} from './home.cmp';

const ROUTES: Routes = [
    {path: '', component: HomeCmp}
]

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [
        HomeCmp,
    ]
})

export class HomeModule
{
}