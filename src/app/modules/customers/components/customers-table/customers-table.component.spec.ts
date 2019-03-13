import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

import {
  DatePipe,
  DateTimePipe,
  LoadingIndicatorComponent
} from '@app/modules/shared';
import {
  ConfigResolverService,
  RegionsService,
  TimeFormatService,
  UserService,
  WebsocketService
} from '@app/modules/core';

import {CustomersTableComponent} from './customers-table.component';
import {Customer} from '@app/modules/customers/models/customer';
import {CUSTOMERS_LIST_TYPES} from '@app/modules/customers/constants/customers-list-types';
import {BlockCustomerComponent} from '@app/modules/customers/components/block-customer/block-customer.component';
import {CustomersService} from '@app/modules/customers/services/customers.service';
import {TimeFormatServiceStub} from '@testing/time-format-service-stub';
import {ActivatedRouteStub, RouterStub} from '@testing/router-stubs';
import {CustomersServiceStub} from '@testing/customers-service-stub';
import {Ng2ToastyStubComponent, ToastyServiceStub} from '@testing/toast-stubs';
import {WebSocketServiceStub} from '@testing/websocket-service-stub';
import {UserServiceStub} from '@testing/user-service-stub';
import {RegionsServiceStub} from '@testing/regions-service-stub';
import {ConfigResolverServiceStub} from '@testing/config-resolver-stub';

function generateCustomers(count): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const customer = new Customer();
    customer.id = `${i + 1}`;
    customer.firstName = `customer-${i}`;
    customer.lastName = `last-${i}`;
    customer.email = `customer${i}@gmail.com`;
    customer.tripsCount = i + 10;
    customer.registrationDate = '2018-01-10T15:22:24Z';
    customer.blockingDate = '2018-08-18T11:00:00Z';
    customer.phone = `+7123456${i}`;
    customer.photo = 'photo';
    customer.rating = i;
    customer.firstRideRegion = '861';

    customers.push(customer);
  }

  return customers;
}

describe('CustomersTableComponent', () => {
  let component: CustomersTableComponent;
  let fixture: ComponentFixture<CustomersTableComponent>;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule
      ],
      declarations: [
        CustomersTableComponent,
        DatePipe,
        BlockCustomerComponent,
        LoadingIndicatorComponent,
        Ng2ToastyStubComponent,
        DateTimePipe
      ],
      providers: [
        {provide: CustomersService, useClass: CustomersServiceStub},
        {provide: ToastrService, useClass: ToastyServiceStub},
        {provide: TimeFormatService, useClass: TimeFormatServiceStub},
        {provide: WebsocketService, useClass: WebSocketServiceStub},
        {provide: UserService, useClass: UserServiceStub},
        {provide: RegionsService, useClass: RegionsServiceStub},
        {provide: ConfigResolverService, useClass: ConfigResolverServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    let listType;

    beforeEach(() => {
      listType = CUSTOMERS_LIST_TYPES.active;

      component.customers = generateCustomers(10);
      component.listType = listType;
      fixture.detectChanges();
    });

    it('should render customer first name and last name into first column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column1 = firstRow.queryAll(By.css('td'))[0].nativeElement;

      expect(column1.innerText.trim()).toBe('last-0 customer-0');
    });

    it('should render customer phone into second column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column2 = firstRow.queryAll(By.css('td'))[1].nativeElement;

      expect(column2.innerText.trim()).toBe('+71234560');
    });

    it('should render customer email into third column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column3 = firstRow.queryAll(By.css('td'))[2].nativeElement;

      expect(column3.innerText.trim()).toBe('customer0@gmail.com');
    });

    it('should render registration date into forth column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column4 = firstRow.queryAll(By.css('td'))[3].nativeElement;

      expect(column4.innerText.trim()).toBe('01/10/2018');
    });

    it('should render blocking date into forth column if list type is blocked', () => {
      component.listType = CUSTOMERS_LIST_TYPES.blocked;
      fixture.detectChanges();

      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column4 = firstRow.queryAll(By.css('td'))[3].nativeElement;

      expect(column4.innerText.trim()).toBe('08/18/2018');
    });

    it('should render trips count into fifth column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column5 = firstRow.queryAll(By.css('td'))[4].nativeElement;

      expect(column5.innerText.trim()).toBe('10');
    });

    it('should render rating into sixth column', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const column6 = firstRow.queryAll(By.css('td'))[5].nativeElement;

      expect(column6.innerText.trim()).toBe('0');
    });

    it('should not render column with unblock button if listType is active', () => {
      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const columnsCount = firstRow.queryAll(By.css('td')).length;

      expect(columnsCount).toBe(6);
    });

    it('should render column with unblock button if listType is blocked', () => {
      component.listType = CUSTOMERS_LIST_TYPES.blocked;
      fixture.detectChanges();

      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const columnsCount = firstRow.queryAll(By.css('td')).length;

      expect(columnsCount).toBe(7);
    });
  });
});
