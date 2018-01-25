import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared';

import { HomeComp } from './home.comp';
import { TreeViewMenuComp } from './treeview.menu.comp';
import { SidebarMenuComp } from './sidebar.menu.comp';

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
        TreeViewMenuComp,
        SidebarMenuComp
    ],
    entryComponents: [
        TreeViewMenuComp,
        SidebarMenuComp
    ],
    exports: [
        TreeViewMenuComp,
        SidebarMenuComp
    ]
})

export class HomeModule
{
}
