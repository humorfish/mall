import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({selector: 'c-home', templateUrl: 'home.comp.html'})
export class HomeComp implements OnInit
{
    constructor(private router: Router)
    {
    }

    ngOnInit()
    {
        // this.router.navigate(['/auth/login']);
    }

    Toast()
    {
        App.ShowToast('aaaa');
    }

    App = window.App;
}