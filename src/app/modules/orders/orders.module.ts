import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { Slider, SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ImageModule } from 'primeng/image';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { LayoutService } from 'src/app/layout/service/app.layout.service';



@NgModule({

  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersRoutingModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    DataViewModule,
    TooltipModule,
    InputNumberModule,
    SkeletonModule,
    DialogModule,
    AutoCompleteModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ImageModule,
    SidebarModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    ConfirmPopupModule
/*    */
  ],
  declarations: [
    OrdersComponent
  ],

  providers:[
    MessageService,
    ConfirmationService,
    LayoutService
  ]
})
export class OrdersModule { }
