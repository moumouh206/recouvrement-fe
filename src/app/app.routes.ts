// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard'; // <-- Import new dashboard
import { RedevableListComponent } from './pages/redevable-list/redevable-list';
import { BordereauListComponent } from './pages/bordereau-list/bordereau-list';
import { BordereauCreateComponent } from './pages/bordereau-create/bordereau-create';
import { RecouvrementSearchComponent } from './pages/recouvrement-search/recouvrement-search';
import { PoursuiteListComponent } from './pages/poursuite-list/poursuite-list';
import { RecettesSansTitreComponent } from './pages/recettes-sans-titre/recettes-sans-titre';
import { AdminParametresComponent } from './pages/admin-parametres/admin-parametres';
import { AdminClotureComponent } from './pages/admin-cloture/admin-cloture';
import { AdminRetablissementComponent } from './pages/admin-retablissement/admin-retablissement';
import { ReportingComponent } from './pages/reporting/reporting';
import { ProfileComponent } from './pages/profile/profile';
import { WipComponent } from './pages/wip/wip'; // <-- Work-in-progress component

export const routes: Routes = [
  // Login route is separate, without the main layout
  {
    path: 'login',
    component: LoginComponent,
  },

  // Main application layout
  {
    path: '',
    component: MainLayoutComponent,
    // In the future, a `canActivate: [authGuard]` will protect these routes
    children: [
      // Actual implemented pages
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },

      { path: 'redevables', component: RedevableListComponent },
      // Prise en Charge
      { path: 'bordereaux', component: BordereauListComponent },
      { path: 'bordereaux/nouveau', component: BordereauCreateComponent },
      // Recouvrement
      {
        path: 'recouvrement/recherche',
        component: RecouvrementSearchComponent,
      },
      // Poursuites
      { path: 'poursuites', component: PoursuiteListComponent },
      // Recettes sans Titre
      { path: 'recettes-sans-titre', component: RecettesSansTitreComponent },
      // Administration
      { path: 'admin/parametres', component: AdminParametresComponent },
      { path: 'admin/cloture', component: AdminClotureComponent },
      { path: 'admin/retablissement', component: AdminRetablissementComponent },
      { path: 'reporting', component: ReportingComponent },

      // Default route redirects to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Catch-all route for any other path
  { path: '**', redirectTo: 'dashboard' },
];
