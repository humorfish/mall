import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    selector: 'chart-page',
    styleUrls: ['./chart.scss'],
    templateUrl: 'chart.html'
})
export class ChartComp implements OnInit
{
    constructor(public location: Location)
    {
    }

    ngOnInit()
    {

    }
}
