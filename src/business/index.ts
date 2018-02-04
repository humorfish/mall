import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusinessComp } from './business.comp';

const homeRouters: Routes = [
    {path: '', component: BusinessComp}
];

@NgModule({
    imports: [
        RouterModule.forChild(homeRouters)
    ],
    exports: [
        RouterModule
    ]
})
export class BusinessRoutingModule {}
