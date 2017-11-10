import {Injectable} from "@angular/core";

import {ToastConfig, ToastType} from "./toast.model";

@Injectable()
export class ToastService 
{
    constructor()
    {
    }

    Success(message: string)
    {
        this.Show(new ToastConfig(ToastType.SUCCESS, message));
    }

    Info(message: string)
    {

    }

    Warning(message: string)
    {

    }

    Error(message: string)
    {

    }

    private Show(config: ToastConfig): Promise<void>
    {
    }
}