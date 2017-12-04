import {Component} from '@angular/core';
import {TApplication} from '../services';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
            <c-toast-box ToastAnimation="fancy"></c-toast-box>`
})
export class AppComponent 
{
    constructor(App: TApplication)
    {
    }
}
