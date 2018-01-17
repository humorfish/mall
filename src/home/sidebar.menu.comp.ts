import { Component, Input } from '@angular/core';
import { MenuData } from './main.model';

@Component({
    selector: 'c-sidebar-menu',
    templateUrl: 'sidebar.menu.comp.html',
    styleUrls: ['sidebar.menu.comp.scss']
})
export class SidebarMenuComp
{
    constructor()
    {

    }

    inputSearchText(v: any)
    {

    }

    searchMenu()
    {

    }

    itemClicked(item: MenuData)
    {

    }

    iconStyle(item: MenuData): object
    {
        return {'fa-angle-down': ! this.isLeaf(item) && item.isExpend, 'fa-angle-left': ! this.isLeaf(item) && ! item.isExpend};
    }

    isLeaf(item: MenuData)
    {

    }


    @Input() data: Array<MenuData>;
    searchMsgHidden: boolean = false;
}
