import {Injectable} from '@angular/core';

import {Subject, Observable} from 'Rxjs';
import {ToastConfig} from './toast.model';

@Injectable()
export class ToastService
{
    constructor()
    {
    }

    Show(Config: ToastConfig)
    {
        this.ToastSub.next(Config);
    }

    Subscribe(): Observable<ToastConfig>
    {
        return this.ToastSub;
    }

    private ToastSub = new Subject<ToastConfig>();
}
