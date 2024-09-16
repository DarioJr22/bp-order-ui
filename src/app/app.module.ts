import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
      domain: 'seu-dominio.com'
    },
    palette: {
      popup: {
        background: '#232323'
      },
      button: {
        background: '#ffcc00'
      }
    },
    theme: 'classic',
    type: 'info', // ou 'opt-out', 'opt-in'
    content: {
      message: 'Nós utilizamos cookies para melhorar sua experiência no site.',
      dismiss: 'Aceito',
      deny: 'Recusar',
      link: 'Saiba mais',
      href: '/politica-de-cookies' // Rota para a política de cookies
    }
  };



@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule,
        BrowserAnimationsModule,
        NgcCookieConsentModule.forRoot(cookieConfig)
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
