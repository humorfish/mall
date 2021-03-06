
import {Component, Input} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

import {ToastConfig} from './toast.model';
import {ToastService} from './toast.service';

@Component({selector: 'c-toast-box', templateUrl: 'toast.box.comp.html', styleUrls: ['toast.box.comp.scss'], animations: [
    trigger('ToastBoxTrigger',
    [
        // state('none', style({})),
        // state('decent', style([{opacity: 1}, {maxHeight: 300}])),
        // state('fancy', style([{transform: 'translateX(0)'}, {transform: 'translateY(0)'}, {opacity: 0}, {maxHeight: 300}])),
        // transition('void => fancy',
        // [
        //     style({opacity: 0, maxHeight: 0, transform: 'translateY(-100%)'}),
        //     animate('300ms ease-in-out')
        // ]),
        // transition('fancy => void',
        // [
        //     animate('300ms ease-in-out', style({transform: 'translateY(100%)', height: 0, opacity: 0}))
        // ]),
        // transition('void => decent',
        // [
        //     style({opacity: 0, maxHeight: 0}),
        //     animate('300ms ease-in-out')
        // ]),
        // transition('decent => void',
        // [
        //     animate('300ms ease-in-out', style({height: 0, opacity: 0}))
        // ])
        state('none', style({})),
        state('decent', style([{opacity: 1}, {maxHeight: 300}])),
        state('fancy', style([{transform: 'translateX(0)'}, {transform: 'translateY(0)'}, {opacity: 1}, {maxHeight: 300}])),
        transition('void => fancy', [
          style({opacity: 0, maxHeight: 0, transform: 'translateY(-100%)'}),
          animate('300ms ease-in-out')
        ]),
        transition('fancy => void', [
          animate('300ms ease-in-out', style({transform: 'translateX(100%)', height: 0, opacity: 0}))
        ]),
        transition('void => decent', [
          style({opacity: 0, maxHeight: 0}),
          animate('300ms ease-in-out')
        ]),
        transition('decent => void', [
          animate('300ms ease-in-out', style({height: 0, opacity: 0}))
        ])
    ])
]})
export class ToastBoxComp
{
    constructor(private ToastSvc: ToastService)
    {
        this.ToastSvc.Subscribe().forEach(config =>
        {
            this.ToastConfigs.unshift(config);
        });
    }

    Remove(Config: ToastConfig)
    {
        if (this.ToastConfigs.indexOf(Config) >= 0)
        {
            this.ToastConfigs.splice(this.ToastConfigs.indexOf(Config), 1);
        }
    }

    @Input() ToastAnimation: string = 'none';
    @Input() ToastPosition: string = 'c-toast-top-center';

    private ToastConfigs: Array<ToastConfig> = [];
}
