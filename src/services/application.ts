import {Injectable, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

declare global
{
    /* extends Application to window global variable */
    var App: TApplication | undefined;

    interface Window
    {
        App: TApplication | undefined;
    }
}

@Injectable()
export class TApplication 
{
    constructor(injector: Injector)
    {
        window.App = this;
        this.Translation = injector.get(TranslateService);
        this.InitLanguage();
    }

    private InitLanguage()
    {
        this.Translation.addLangs(['en', 'zh']);
        this.Translation.setDefaultLang('en');
        let browserLang = App.Translation.getBrowserLang().toLowerCase();
        console.log('Browser Language: ' + browserLang);

        if (browserLang.match(/zh-chs|zh|zh-CN|zh-cht|zh-tw|zh-hk|zh-sg/))
            this.Translation.use('zh');
    }

    private Translation: TranslateService;
}