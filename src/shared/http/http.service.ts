import {Injectable} from '@angular/core';
import {Utils} from '../utils';
import {
    Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';

@Injectable()
export class HttpService
{
    constructor(private http: Http)
    {
    }

    Get(url: string, paramMap: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Get,
            search: HttpService.BuildURLSearchParams(paramMap)
        })).toPromise();
    }

    Post(url: string, body: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Post,
            body: body,
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        })).toPromise();
    }

    PostFormData(url: string, paramMap: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Post,
            search: HttpService.BuildURLSearchParams(paramMap),
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'})
        })).toPromise();
    }

    Put(url: string, body: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Put,
            body: body
        })).toPromise();
    }

    Delete(url: string, paramsMap: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Delete,
            search: HttpService.BuildURLSearchParams(paramsMap)
        })).toPromise();
    }

    Patch(url: string, body: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Patch,
            body: body
        })).toPromise();
    }

    Head(url: string, paramsMap: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Head,
            search: HttpService.BuildURLSearchParams(paramsMap)
        })).toPromise();
    }

    Options(url: string, paramsMap: any = null, options: HttpOptions = null): Promise<any>
    {
        return this.http.request(url, new RequestOptions({
            method: RequestMethod.Options,
            search: HttpService.BuildURLSearchParams(paramsMap)
        })).toPromise();
    }

    private static BuildURLSearchParams(paramMap: any): URLSearchParams
    {
        if (Utils.IsEmpty(paramMap))
            return paramMap;
     
        let params = new URLSearchParams();
        for(let key in paramMap)
        {
            let val = paramMap[key];
            if (val instanceof Date)
                val = Utils.DateFormate(val);
            
            params.set(key, val);
        }

        return params;
    }
}

interface HttpOptions
{
    url?: string;
    body?: any;
    paramMap?: any;
    headers?: any;  
}