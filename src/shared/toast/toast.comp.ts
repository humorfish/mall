
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ToastType, ToastConfig} from "./toast.model";

@Component({selector: 'c-toast', templateUrl: 'toast.comp.html', styleUrls: ['toast.comp.css']})
export class ToastComp implements OnInit
{
    constructor()
    {
    }

    ngOnInit()
    {
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

    @Input() Config = new ToastConfig(ToastType.INFO, '');
    
    @Output() Dismissed = new EventEmitter();
}