import {Injectable, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastService, ToastType, ToastConfig} from '../shared/toast';

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

        this.ToastService = injector.get(ToastService);
    }

    /**
     * Language
     */
    private InitLanguage()
    {
        this.Translation.addLangs(['en', 'zh']);
        this.Translation.setDefaultLang('en');
        let browserLang = App.Translation.getBrowserLang().toLowerCase();
        console.log('Browser Language: ' + browserLang);

        if (browserLang.match(/zh-chs|zh|zh-CN|zh-cht|zh-tw|zh-hk|zh-sg/))
            this.Translation.use('zh');
    }

    /**
     * Toast
     */
    ShowToast(Message: string, Type?: ToastType)
    {
        let _Type = Type;
        if (_Type === undefined)
            _Type = ToastType.INFO;
        return this.ToastService.Show(new ToastConfig(_Type, Message));
    }

    ShowError(Message: string)
    {
        return this.ShowToast(Message, ToastType.ERROR);
    }

    Translate(key: string): string
    {
        return this.Translation.instant(key);
    }

    private Translation: TranslateService;
    private ToastService: ToastService;
}
