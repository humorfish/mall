import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {HomeComp} from './home.comp';
import {ChartComp} from './chart/chart';

const ROUTES: Routes = [
    {
        path: '', component: HomeComp
    },
    {
        path: 'chart', component: ChartComp
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    declarations: [
        HomeComp,
        ChartComp
    ],
    entryComponents: [
        ChartComp
    ],
    exports: [
        ChartComp
    ]
})

export class HomeModule
{
}
