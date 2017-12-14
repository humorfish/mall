import {Component} from '@angular/core';
import {SpinService} from './spin.service';

@Component({selector: 'spin-comp', templateUrl: 'spin.comp.html', styleUrls: ['spin.comp.scss']})
export class SpinComp
{
    constructor(private Spin: SpinService)
    {
        this.Spin.GetSpin().forEach((ShowSpin: boolean) => 
        {
            if (ShowSpin)
                this.OpenSpin();
            else
                this.CloseSpin();
        });
    }

    private OpenSpin()
    {
        if (! this.ShowSpin)
            this.ShowSpin = true;

        this.Count++;
    }

    private CloseSpin()
    {
        this.Count--;
        if (this.Count <= 0)
        {
            this.ShowSpin = false;
            this.Count = 0;
        }
    }

    ShowSpin: boolean = false;
    Count: number = 0;
}