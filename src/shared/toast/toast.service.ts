import {Injectable} from "@angular/core";

import {ToastConfig, ToastType} from "./toast.model";
import {Subject, Observable} from "rxjs";

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