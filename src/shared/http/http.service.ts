import {Injectable} from '@angular/core';
import {Http, Response, Headers, } from '@angular/http';

import {  } from '../util/utils';

@Injectable()
export class HttpService
{
    constructor(private http: Http, private Spin: SpinService)
    {
    }
}