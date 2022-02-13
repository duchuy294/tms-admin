import { AuthService } from './../services/auth.service';
import { PagesComponent } from './pages.component';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from '@/services/can-activate.guard';

export const routes: Routes = [
    { path: 'login', loadChildren: () => import('app/pages/login/login.module').then(m => m.LoginModule) },
    {
        path: 'pages',
        canActivate: [AuthService],
        component: PagesComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard/welcome',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivateChild: [CanActivateGuard],

            },
            {
                path: 'marketing',
                loadChildren: () => import('./marketing-management/marketing-management.module').then(m => m.MarketingManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'notification',
                loadChildren: () => import('./notification-management/notification-management.module').then(m => m.NotificationManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'order',
                loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'admins',
                loadChildren: () => import('./admins-management/admins-management.module').then(m => m.AdminsManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'customer-management',
                loadChildren: () => import('./customer-management/customer-management.module').then(m => m.CustomerManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'finance',
                loadChildren: () => import('./finance-management/finance-management.module').then(m => m.FinanceManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'profile-info',
                loadChildren: () => import('./profile-info/profile-info.module').then(m => m.ProfileInfoModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'service-management',
                loadChildren: () => import('./service-management/service-management.module').then(m => m.ServiceManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'servicer-management',
                loadChildren: () => import('./servicer-management/servicer-management.module').then(m => m.ServicerManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings-management/settings-management.module').then(m => m.SettingsManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'statistic',
                loadChildren: () => import('./statistic/statistic.module').then(m => m.StatisticModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'system-setting',
                loadChildren: () => import('./system-setting-management/system-setting-management.module').then(m => m.SystemSettingManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'warranty-repair',
                loadChildren: () => import('./warranty-repair-management/warranty-repair-management.module').then(m => m.WarrantyRepairManagementModule),
                canActivateChild: [CanActivateGuard],
            },
            {
                path: 'warehouse',
                loadChildren: () => import('./warehouse-management/warehouse-management.module').then(m => m.WarehouseManagementModule),
                canActivateChild: [CanActivateGuard],
            },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
