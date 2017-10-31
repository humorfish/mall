import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({selector: 'c-home', templateUrl: 'home.cmp.html'})
export class HomeCmp implements OnInit
{
    constructor(private router: Router)
    {
    }

    ngOnInit()
    {
        this.router.navigate(['/auth/login']);
    }
}