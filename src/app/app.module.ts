import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {SharedModule} from './modules/shared/shared.module';
import {IsLoggedInGuard} from '@app/shared';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        SharedModule,
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule.forRoot([
            {
                path: 'customers',
                loadChildren: 'app/modules/customers/customers.module#CustomersModule',
                canLoad: [
                    IsLoggedInGuard
                ],
                canActivate: [
                    IsLoggedInGuard
                ],
                canActivateChild: [
                    IsLoggedInGuard
                ]
            }
        ])
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}