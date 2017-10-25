import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeCmp} from './home.cmp';

const ROUTES: Routes = [
    {path: '', component: HomeCmp}
]

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        HomeCmp,
    ]
})

export class HomeModule
{
}