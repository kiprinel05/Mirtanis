import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServicesComponent } from '../home/sections/services/services.component';

@Component({
  selector: 'fb-services-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ServicesComponent],
  template: `
    <div class="pt-32">
      <fb-services />
    </div>
  `,
})
export class ServicesPageComponent {}
