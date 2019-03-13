import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';
import {TranslateModule} from '@ngx-translate/core';
import {TextMaskModule} from 'angular2-text-mask';

import {Observable} from 'rxjs/Observable';

import {
  ConfigResolverService,
  TimeFormatService,
  UserService,
  WebsocketService
} from '@app/modules/core';
import {
  DatePipe,
  LoadingIndicatorComponent,
  PaginationComponent
} from '@app/modules/shared';

import {CustomersListComponent} from './customers-list.component';
import {CustomersTableComponent} from '@app/modules/customers/components/customers-table/customers-table.component';
import {Customer} from '@app/modules/customers/models/customer';
import {CustomersService} from '@app/modules/customers/services/customers.service';
import {CUSTOMERS_LIST_TYPES} from '@app/modules/customers/constants/customers-list-types';
import {SearchCustomersFormComponent} from '@app/modules/customers/components/search-customers-form/search-customers-form.component';

import {TimeFormatServiceStub} from '@testing/time-format-service-stub';
import {WebSocketServiceStub} from '@testing/websocket-service-stub';
import {UserServiceStub} from '@testing/user-service-stub';
import {CustomersServiceStub} from '@testing/customers-service-stub';
import {ActivatedRouteStub, RouterStub} from '@testing/router-stubs';
import {Ng2ToastyStubComponent, ToastyServiceStub} from '@testing/toast-stubs';
import {ConfigResolverServiceStub} from '@testing/config-resolver-stub';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
    customer.phone = `+7123456${i}`;
    customer.photo = 'photo';
    customer.rating = i;
    customer.firstRideRegion = '861';

    customers.push(customer);
  }

  return customers;
}

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;

  let customersService: CustomersService;
  let toastr: ToastrService;
  let router;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NgbModule.forRoot(),
        FormsModule,
        TextMaskModule,
        RouterModule
      ],
      declarations: [
        CustomersListComponent,
        CustomersTableComponent,
        LoadingIndicatorComponent,
        Ng2ToastyStubComponent,
        PaginationComponent,
        DatePipe,
        SearchCustomersFormComponent
      ],
      providers: [
        {provide: CustomersService, useClass: CustomersServiceStub},
        {provide: WebsocketService, useClass: WebSocketServiceStub},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: ToastrService, useClass: ToastyServiceStub},
        {provide: Router, useClass: RouterStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    customersService = TestBed.get(CustomersService);
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    activatedRoute.testParamMap = {};
    activatedRoute.testQueryParamMap = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should request customers list right after component init if list type is active', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };

      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.ngOnInit();

      expect(getCustomersListSpy.calls.any()).toBeTruthy();
    });

    it('should request customers list right after component init if list type is blocked', () => {
      activatedRoute.testParamMap = {
        type: 'blocked'
      };

      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.ngOnInit();

      expect(getCustomersListSpy.calls.any()).toBeTruthy();
    });

    it('should request customers list with correct params', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };

      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.ngOnInit();

      expect(getCustomersListSpy.calls.mostRecent().args[0]).toBe(1);
      expect(getCustomersListSpy.calls.mostRecent().args[1]).toBe(CUSTOMERS_LIST_TYPES.active);
    });

    it('should request customers list with correct params if list type is blocked', () => {
      activatedRoute.testParamMap = {
        type: 'blocked'
      };

      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.ngOnInit();

      expect(getCustomersListSpy.calls.mostRecent().args[0]).toBe(1);
      expect(getCustomersListSpy.calls.mostRecent().args[1]).toBe(CUSTOMERS_LIST_TYPES.blocked);
    });

    it('should display error if service method returns it', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };

      spyOn(customersService, 'getCustomersList').and.returnValue(Observable.throw('some error'));
      const errorSpy = spyOn(toastr, 'error');

      component.ngOnInit();

      expect(errorSpy.calls.count()).toBe(1);
    });

    it('should set customers and pages count from service method', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };
      const customers = generateCustomers(20);
      const pagesCount = 8;

      spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: customers, pagesCount: pagesCount}));

      component.ngOnInit();

      expect(component.customers).toEqual(customers);
      expect(component.pagesCount).toBe(pagesCount);
    });

    it('should set correct form values from query params', () => {
      activatedRoute.testParamMap = {
        type: 'all'
      };

      activatedRoute.testQueryParamMap = {
        email: 'test email',
        first_name: 'test name',
        last_name: 'test last name',
        phone: '+71234567890',
        promo_code: 'test promo'
      };

      expect(component.searchForm.email).toBe('test email');
      expect(component.searchForm.firstName).toBe('test name');
      expect(component.searchForm.lastName).toBe('test last name');
      expect(component.searchForm.phone).toBe('71234567890');
      expect(component.searchForm.promoCode).toBe('test promo');
    });

    it('should request search customers right after component init if list type is all', () => {
      activatedRoute.testParamMap = {
        type: 'all'
      };
      component.ngOnInit();

      const searchCustomersSpy = spyOn(customersService, 'searchCustomers').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.ngOnInit();

      expect(searchCustomersSpy.calls.any()).toBeTruthy();
    });

    it('should request search customers with correct params', () => {
      const searchCustomersSpy = spyOn(customersService, 'searchCustomers').and.returnValue(Observable.of({data: [], pagesCount: 1}));
      activatedRoute.testParamMap = {
        type: 'all'
      };
      component.ngOnInit();

      expect(searchCustomersSpy.calls.mostRecent().args[0]).toBe(1);
      expect(searchCustomersSpy.calls.mostRecent().args[1]).toBe('');
      expect(searchCustomersSpy.calls.mostRecent().args[2].email).toBe('');
      expect(searchCustomersSpy.calls.mostRecent().args[2].phone).toBe('');
      expect(searchCustomersSpy.calls.mostRecent().args[2].firstName).toBe('');
      expect(searchCustomersSpy.calls.mostRecent().args[2].lastName).toBe('');
      expect(searchCustomersSpy.calls.mostRecent().args[2].promoCode).toBe('');
    });

    it('should display error if service method returns it', () => {
      activatedRoute.testParamMap = {
        type: 'all'
      };
      component.ngOnInit();

      spyOn(customersService, 'searchCustomers').and.returnValue(Observable.throw('some error'));
      const errorSpy = spyOn(toastr, 'error');

      component.ngOnInit();

      expect(errorSpy.calls.count()).toBe(1);
    });
  });

  describe('onPageChanged', () => {

    it('should call getCustomersList method with correct params if list type is active', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };
      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.onPageChanged(42);

      expect(getCustomersListSpy.calls.mostRecent().args[0]).toBe(42);
    });

    it('should call getCustomersList method with correct params if list type is blocked', () => {
      activatedRoute.testParamMap = {
        type: 'blocked'
      };
      const getCustomersListSpy = spyOn(customersService, 'getCustomersList').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.onPageChanged(42);

      expect(getCustomersListSpy.calls.mostRecent().args[0]).toBe(42);
    });

    it('should call searchCustomers method with correct params if list type is all', () => {
      activatedRoute.testParamMap = {
        type: 'all'
      };
      const getCustomersListSpy = spyOn(customersService, 'searchCustomers').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.onPageChanged(42);

      expect(getCustomersListSpy.calls.mostRecent().args[0]).toBe(42);
    });

    it('should set correct query params', () => {
      activatedRoute.testParamMap = {
        type: 'active'
      };
      const routerNavigate = spyOn(router, 'navigate');
      component.onPageChanged(13);

      expect(routerNavigate.calls.mostRecent().args[1].queryParams).toEqual({
        page: '13'
      });
    });
  });

  describe('onSubmit', () => {
    let formValue;

    beforeEach(() => {
      formValue = {
        email: 'expected@emil.com',
        phone: '+71234567890',
        firstName: 'expected name',
        lastName: 'expected last name',
        promoCode: 'expected promo code'
      };

      activatedRoute.testParamMap = {
        type: 'all'
      };
    });

    it('should call searchCustomers method with correct params', () => {
      const searchCustomersSpy = spyOn(customersService, 'searchCustomers').and.returnValue(Observable.of({data: [], pagesCount: 1}));

      component.onSubmit(formValue);

      expect(searchCustomersSpy.calls.mostRecent().args[0]).toBe(1);
      expect(searchCustomersSpy.calls.mostRecent().args[1]).toEqual(formValue);
    });

    it('should set correct query params', () => {
      const routerNavigate = spyOn(router, 'navigate');

      component.onSubmit(formValue);

      expect(routerNavigate.calls.mostRecent().args[1].queryParams).toEqual({
        page: '1',
        email: 'expected@emil.com',
        phone: '+71234567890',
        first_name: 'expected name',
        last_name: 'expected last name',
        promo_code: 'expected promo code'
      });
    });
  });
});
