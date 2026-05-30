import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { SmoothScrollDirective } from './shared/directives/smooth-scroll.directive';
import { CustomCursorComponent } from './shared/components/custom-cursor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CustomCursorComponent, SmoothScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-custom-cursor></app-custom-cursor>
    <app-navbar></app-navbar>
    <main appSmoothScroll class="route-enter min-h-screen">
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // hook for analytics / future enhancements
  }
}
