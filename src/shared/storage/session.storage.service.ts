import {Injectable} from '@angular/core';

@Injectable()
export class SessionStorageService
{
    constructor()
    {
        if (! sessionStorage)
            throw new Error('browser not supports SessionStorage');
        else
            this.SessionStorage = window.sessionStorage;
    }

    public Set(key: string, value: string)
    {
        this.SessionStorage[key] = value;
    }

    public Get(key: string): string
    {
        return this.SessionStorage[key] || false;
    }

    public SetObject(key: string, value: any)
    {
        this.SessionStorage[key] = JSON.stringify(value);
    }

    public GetObject(key: string): any
    {
        return JSON.parse(this.SessionStorage[key] || '{}');
    }

    public Remove(key: string)
    {
        this.SessionStorage.removeItem(key);
    }

    private SessionStorage: any;
}