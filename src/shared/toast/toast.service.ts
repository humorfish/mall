import {Injectable} from "@angular/core";

import {Subject} from "rxjs/Subject";
import {ToastConfig, ToastType} from "./toast.model";


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

    private ToastSub = new Subject<ToastConfig>();
}