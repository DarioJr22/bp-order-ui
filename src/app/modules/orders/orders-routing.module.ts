import { OrdersComponent } from './orders.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OrdersComponent }
    ])],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
