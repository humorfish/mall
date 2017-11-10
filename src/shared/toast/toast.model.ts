/**
 * type
 */
export enum ToastType 
{
    SUCCESS, 
    INFO, 
    WARNING, 
    ERROR
}

/**
 * config
 */

export class ToastConfig
{
    constructor(type: ToastType, message: string, AutoDismissTime?: number, dismissable?: boolean)
    {
        this.Type = type;
        this.Message = message;
        
        this.AutoDismissTime = AutoDismissTime;
        if (this.AutoDismissTime === undefined)
            this.AutoDismissTime = 1000;
        
        this.Dismissable = dismissable;
        if (this.Dismissable === undefined)
            this.Dismissable = true;
    }

    GetToastType(): ToastType
    {
        return this.Type;
    }

    GetMessage(): string
    {
        return this.Message;
    }

    GetAutoDismissTime(): number
    {
        return this.AutoDismissTime;
    }

    IsDismissable(): boolean
    {
        return this.Dismissable;
    }

    private Type: ToastType;
    private Message: string;
    private AutoDismissTime: number;
    private Dismissable: boolean;
}