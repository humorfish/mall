import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';

import {ServiceModule} from '../services';

import {AppComponent} from './app.component';

const ROUTES: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', loadChildren: '../home/index#HomeModule'},
    {path: 'auth', loadChildren: '../authorize/index#AuthorizeModule'}
];

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(ROUTES),
      ServiceModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule 
{
}
