import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {TApplication} from './application';

export function createTranslateLoader(http: HttpClient)
{
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        NgbModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient]}})
    ],
    exports: [
        NgbModule,
        HttpClientModule,
        TranslateModule,
    ],
    providers: [
        TApplication
    ]
})

export class ServiceModule
{
}

export {TApplication};
