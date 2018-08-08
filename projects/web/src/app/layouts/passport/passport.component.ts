import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];

  constructor(private _router: Router, @Inject(DOCUMENT) private _document) {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.hideSpinner();
      });
  }

  private hideSpinner(): void {
    const preloader = this._document.querySelector('.preloader');
    // preloader value null when running --hmr
    if (!preloader) return;

    preloader.className = 'preloader-hidden';
  }
}
