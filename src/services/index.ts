import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';


export function createTranslateLoader(http: HttpClient) 
{
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient]}})
    ],
    exports: [
        HttpClientModule,
        TranslateModule,
    ]
})

export class ServiceModule
{
}