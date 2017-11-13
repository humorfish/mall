
import {Component} from "@angular/core/src/core";
import {trigger, state, style, transition, animate} from "@angular/animations";

@Component({selector: 'c-toast-box', templateUrl: 'toast.box.comp.html', styleUrls: ['toast.box.comp.scss'], animations: [
    trigger('toast_box_trigger', 
    [
        state('none', style({})),
        state('decent', style([{opacity: 1}, {maxHeight: 300}])),
        state('fancy', style([{transform: 'translateX(0)'}, {transform: 'translateY(0)'}, {opacity: 0}, {maxHeight: 300}])),
        transition('void => fancy',
        [
            style({opacity: 0, maxHeight: 0, transform: 'translateY(-100%)'}),
            animate('300ms ease-in-out')
        ]),
        transition('fancy => void',
        [
            animate('300ms ease-in-out', style({transform: 'translateY(100%)', height: 0, opacity: 0}))
        ]),
        transition('void => decent',
        [
            style({opacity: 0, maxHeight: 0}),
            animate('300ms ease-in-out')
        ]),
        transition('decent => void', 
        [
            animate('300ms ease-in-out', style({height: 0, opacity: 0}))
        ])
    ])
]})
export class ToastBoxComp
{
    constructor()
    {
    }
}