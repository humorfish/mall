import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app.component';

const ROUTES: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', loadChildren: '../home/index#HomeModule'},
    {path: 'auth', loadChildren: '../authorize/index#AuthorizeModule'}
];

export function createTranslateLoader(http: HttpClient) 
{
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(ROUTES),
      TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient]}})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule 
{
}
