import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Mirtanis Events — Locație premium pe lac'
  },
  {
    path: 'galerie',
    loadComponent: () => import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
    title: 'Galerie — Mirtanis Events'
  },
  {
    path: 'rezervari',
    loadComponent: () => import('./pages/booking/booking.component').then((m) => m.BookingComponent),
    title: 'Verifică disponibilitatea — Mirtanis Events'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact — Mirtanis Events'
  },
  {
    path: 'locatii',
    loadComponent: () => import('./pages/locations/locations.component').then((m) => m.LocationsComponent),
    title: 'Locațiile noastre — Mirtanis Events'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Admin · Login'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    title: 'Admin · Dashboard'
  },
  { path: '**', redirectTo: '' }
];
