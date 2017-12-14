import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

/**
 * spin
 */

@Injectable()
export class SpinService
{
    constructor()
    {
    }

    Subscribe(): Subject<boolean>
    {
        return this.SpinSub;
    }

    Spin(ShowSpin: boolean): void
    {
        this.SpinSub.next(ShowSpin);
    }

    private SpinSub: Subject<boolean> = new Subject<boolean>();
}
