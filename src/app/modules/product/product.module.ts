import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductRoutingModule } from './product.routing.module';
import { ProductsComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProductService } from './product.service';
@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule,
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
        TableModule,
        DropdownModule,
        TagModule,
        InputNumberModule,
        CalendarModule,
        ImageModule,
        TooltipModule,
        DialogModule
    ],
    declarations: [ProductsComponent],
    providers:[MessageService,ProductService]
})
export class ProductModule { }
