import { Routes } from "@angular/router";

import { adminGuard } from "./core/guards/admin.guard";

export const routes: Routes = [
  // ---- Existing presentation site (UNCHANGED) ----
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
    title: "Foto Bugeac — Studio Foto",
  },
  {
    path: "portfolio",
    loadComponent: () =>
      import("./pages/portfolio-page/portfolio-page.component").then(
        (m) => m.PortfolioPageComponent,
      ),
    title: "Portofoliu — Foto Bugeac",
  },
  {
    path: "services",
    loadComponent: () =>
      import("./pages/services-page/services-page.component").then(
        (m) => m.ServicesPageComponent,
      ),
    title: "Servicii — Foto Bugeac",
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./pages/contact-page/contact-page.component").then(
        (m) => m.ContactPageComponent,
      ),
    title: "Contact — Foto Bugeac",
  },

  // ---- Private client gallery (public URL, unguessable slug) ----
  {
    path: "gallery/:slug",
    loadComponent: () =>
      import("./pages/gallery/gallery.component").then(
        (m) => m.GalleryComponent,
      ),
    title: "Galerie Privată — Foto Bugeac",
  },

  // ---- Hidden admin section ----
  {
    path: "admin/login",
    loadComponent: () =>
      import("./pages/admin/admin-login.component").then(
        (m) => m.AdminLoginComponent,
      ),
    title: "Admin — Foto Bugeac",
  },
  {
    path: "admin",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./pages/admin/admin-shell.component").then(
        (m) => m.AdminShellComponent,
      ),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/admin/admin-dashboard.component").then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: "event/:id",
        loadComponent: () =>
          import("./pages/admin/admin-event.component").then(
            (m) => m.AdminEventComponent,
          ),
      },
    ],
  },

  { path: "**", redirectTo: "" },
];
