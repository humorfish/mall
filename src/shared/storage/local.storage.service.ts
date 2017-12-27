import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService
{
    constructor()
    {
        if (! localStorage)
            throw new Error('browser not supports localstorage');
        else
            this.LocalStorage = window.localStorage;
    }

    public Set(key: string, value: string)
    {
        this.LocalStorage[key] = value;
    }

    public Get(key: string): string
    {
        return this.LocalStorage[key] || false;
    }

    public SetObject(key: string, value: any)
    {
        this.LocalStorage[key] = JSON.stringify(value);
    }

    public GetObject(key: string): any
    {
        return JSON.parse(this.LocalStorage[key] || '{}');
    }

    public Remove(key: string)
    {
        this.LocalStorage.removeItem(key);
    }

    private LocalStorage: any;
}
