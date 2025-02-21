import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailUserComponent } from './detail-user.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DetailUserComponent }
    ])],
    exports: [RouterModule]
})
export class DetailUserRoutingModule { }
