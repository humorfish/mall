import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

// toast
import {ToastService} from './toast/toast.service';
import {ToastBoxComp} from './toast/toast.box.comp';
import {ToastComp} from './toast/toast.comp';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ToastBoxComp
    ],
    declarations: [
        ToastBoxComp,
        ToastComp
    ],
    providers: [
        ToastService
    ]
})

export class SharedModule
{
}