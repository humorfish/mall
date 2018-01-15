import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({selector: 'c-home', templateUrl: 'home.comp.html'})
export class HomeComp implements OnInit
{
    constructor(public router: Router)
    {
    }

    ngOnInit()
    {
        this.router.navigate(['/auth/login']);
        // this.router.navigate(['chart']);
    }

    App = window.App;
}
