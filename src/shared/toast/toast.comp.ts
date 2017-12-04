
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ToastType, ToastConfig} from "./toast.model";

@Component({selector: 'c-toast', templateUrl: 'toast.comp.html', styleUrls: ['toast.comp.scss']})
export class ToastComp implements OnInit
{
    constructor()
    {
    }

    ngOnInit()
    {
        if (this.Config.GetAutoDismissTime())
            setTimeout(() => this.Dismiss(), this.Config.GetAutoDismissTime());
    }

    get BgStyle(): Object
    {
        let RetVal = 'bg-info';
        
        if (this.Config !== undefined)
        {
            switch (this.Config.GetToastType()) 
            {
                case ToastType.SUCCESS:
                    RetVal = 'bg-success';
                    break;
                case ToastType.INFO:
                    RetVal = 'bg-info';
                    break;
                case ToastType.WARNING:
                    RetVal = 'bg-warning';
                    break;
                case ToastType.ERROR:
                    RetVal = 'bg-error';
                    break;
            
                default:
                    break;
            }
        }

        return RetVal;
    }

    get FaStyle(): Object
    {
        let RetVal = 'bg-info';
        
        if (this.Config !== undefined)
        {
            switch (this.Config.GetToastType()) 
            {
                case ToastType.SUCCESS:
                    RetVal = 'fa-check-circle';
                    break;
                case ToastType.INFO:
                    RetVal = 'fa-info-circle';
                    break;
                case ToastType.WARNING:
                    RetVal = 'fa-warning';
                    break;
                case ToastType.ERROR:
                    RetVal = 'fa-times-circle';
                    break;
            
                default:
                    break;
            }
        }

        return RetVal;
    }

    Dismiss()
    {
        this.Dismissed.emit();
    }

    @Input() Config = new ToastConfig(ToastType.INFO, '');
    
    @Output() Dismissed = new EventEmitter();
}