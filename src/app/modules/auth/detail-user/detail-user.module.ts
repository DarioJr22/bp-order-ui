import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DetailUserRoutingModule } from './detail-user.routing.module';
import { DetailUserComponent } from './detail-user.component';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';


import { Avatar, AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { OrdersModule } from '../../orders/orders.module';
@NgModule({
    imports: [
        CommonModule,
        DetailUserRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ToastModule,
        RouterModule,
        StyleClassModule,
         CommonModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        MultiSelectModule,
        FormsModule,
        CardModule,
        AvatarModule,
        NgxChartsModule,
        OrdersModule
    ],
    declarations: [DetailUserComponent],
    providers:[MessageService]
})
export class DetailUserModule { }
