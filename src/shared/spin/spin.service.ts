import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

/**
 * spin
 */

 @Injectable()
 export class SpinService
 {
     constructor()
     {
     }

     private SpinSub: Subject<boolean> = new Subject<boolean>();
 }
