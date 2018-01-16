import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {HomeComp} from './home.comp';
import {TreaViewMenuComp} from './treeview.menu.comp';

const ROUTES: Routes = [
    {
        path: '', component: HomeComp
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [
        HomeComp,
        TreaViewMenuComp
    ],
    entryComponents: [
        TreaViewMenuComp
    ],
    exports: [
        TreaViewMenuComp
    ]
})

export class HomeModule
{
}
