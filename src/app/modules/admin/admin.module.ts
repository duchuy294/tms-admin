import { AdminService } from './services/admin.service';
import { ApiAdminHttpService } from './services/api-admin-http.service';
import { BranchService } from 'app/modules/admin/services/branch.service';
import { NgModule } from '@angular/core';
import { PrivilegeService } from './services/privilege.service';

@NgModule({
    providers: [
        ApiAdminHttpService,
        AdminService,
        BranchService,
        PrivilegeService
    ]
})
export class AdminModule {}
