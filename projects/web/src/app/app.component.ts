import { Component, HostBinding, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private settings: SettingsService,
    private router: Router,
  ) {}
}
