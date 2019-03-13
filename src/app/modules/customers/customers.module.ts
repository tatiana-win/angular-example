import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TextMaskModule} from 'angular2-text-mask';

import {SharedModule} from '@app/modules/shared/shared.module';

import {CustomersService} from './services/customers.service';
import {CustomersListComponent} from './components/customers-list/customers-list.component';
import {CustomersLayoutComponent} from './components/customers-layout/customers-layout.component';
import {CustomersTableComponent} from './components/customers-table/customers-table.component';
import {SearchCustomersFormComponent} from './components/search-customers-form/search-customers-form.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    TextMaskModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomersLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'all',
            pathMatch: 'full'
          },
          {
            path: ':type',
            component: CustomersListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CustomersService
  ],
  declarations: [
    CustomersListComponent,
    CustomersLayoutComponent,
    CustomersTableComponent,
    SearchCustomersFormComponent
  ]
})
export class CustomersModule {
}
