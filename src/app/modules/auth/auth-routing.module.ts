import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('../../demo/components/auth/error/error.module').then(m => m.ErrorModule) },
        { path: 'access', loadChildren: () => import('../../demo/components/auth/access/access.module').then(m => m.AccessModule) },
        { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        {path:'register',loadChildren:()=>import('./register/register.module').then(m => m.RegisterModule)},
        {path:'detail-user',loadChildren:()=>import('./detail-user/detail-user.module').then(m => m.DetailUserModule)},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
