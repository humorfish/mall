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

    inputSearchText(event: any)
    {
        this.searchText = event.target.value;
    }

    checkSearchMenuIdExists(id: string, menuIdList: Array<string>)
    {
        for (let menuId of menuIdList)
        {
           if (menuId === id)
           {
              return true;
           }
        }

        return false;
    }

    searchItem(item: MenuData, menuList: Array<MenuData>, menuIdList: Array<string>, keyWord: RegExp)
    {
        item.isExpend = false;

        if ((item.name.match(keyWord) || item.keyWord.match(keyWord)) &&
            ! this.checkSearchMenuIdExists(item.id, menuIdList))
        {
                menuList.push(item);
                this.pushSearchMenu(item, menuIdList);
        }

        let itemChildren = item.children;
        if (itemChildren && itemChildren.length > 0)
        {
            for (let subItem of itemChildren)
            {
                this.searchItem(subItem, menuList, menuIdList, keyWord);
            }
        }
    }

    pushSearchMenu(item: MenuData, menuIdList: Array<string>)
    {
        menuIdList.push(item.id);
        let itemChildren = item.children;
        if (itemChildren && itemChildren.length > 0)
        {
            for (let subItem of itemChildren)
                this.pushSearchMenu(subItem, menuIdList);
        }
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
        return (! item.children || ! item.children.length);
    }


    @Input() data: Array<MenuData>;
    searchMsgHidden: boolean = false;
    searchText: string = '';
}
