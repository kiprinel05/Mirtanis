import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContactComponent } from '../home/sections/contact/contact.component';

@Component({
  selector: 'fb-contact-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactComponent],
  template: `
    <div class="pt-32">
      <fb-contact />
    </div>
  `,
})
export class ContactPageComponent {}
