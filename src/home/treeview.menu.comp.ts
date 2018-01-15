import {Component, Input} from '@angular/core';
import {MenuData} from './main.model';
import {Router} from '@angular/router';

@Component({'selector': 'c-treeview-menu', templateUrl: 'treeview.menu.comp.html', styleUrls: ['treeview.menu.comp.scss']})
export class TreaViewMenuComp
{
    constructor(private router: Router)
    {
    }

    /**
     * has children
     * @param item
     */
    isLeaf(item: MenuData): boolean
    {
        return !item.children || !item.children.length;
    }

    /**
     * click
     * @param item
     */
    itemClicked(item: MenuData)
    {
        if (! this.isLeaf(item))
            item.isExpend = !item.isExpend;
        else
            this.router.navigate([item.url]);
    }

    @Input() data: MenuData;
}
