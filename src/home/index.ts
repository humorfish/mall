import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {HomeComp} from './home.comp';

const ROUTES: Routes = [
    {path: '', component: HomeComp}
]

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [
        HomeComp,
    ]
})

export class HomeModule
{
}