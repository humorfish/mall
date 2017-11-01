import {Component} from '@angular/core';
import {TApplication} from '../services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent 
{
    constructor(App: TApplication)
    {
    }
}
