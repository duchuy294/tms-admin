import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages/dashboard/welcome' }
];

export const routing = RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload', urlUpdateStrategy: 'eager', relativeLinkResolution: 'legacy' });