import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';

import {TranslateModule, TranslateService} from '@ngx-translate/core';

import {WebsocketService, ConfigResolverService, UserService} from '@app/modules/core';
import {Driver, LaunchRegion} from '@app/modules/shared';

import {
  CUSTOMERS_EVENT_TYPES,
  CustomersService,
  CUSTOMERS_PER_PAGE_COUNT,
  PROMO_HISTORY_PER_PAGE
} from '@app/modules/customers/services/customers.service';
import {CUSTOMERS_SORT_FIELDS} from '@app/modules/customers/constants/customers-sort-fields';
import {CUSTOMERS_LIST_TYPES} from '@app/modules/customers/constants/customers-list-types';
import {GetCustomersListRequest} from '@app/modules/customers/models/requests/get-customers-list-request';
import {Customer} from '@app/modules/customers/models/customer';
import {SearchCustomersRequest} from '@app/modules/customers/models/requests/search-customers-request';
import {GetCustomerRequest} from '@app/modules/customers/models/requests/get-customer-request';
import {CUSTOMER_ORDERS_SORT_FIELDS} from '@app/modules/customers/constants/customer-orders-sort-fields';
import {GetCustomerOrders} from '@app/modules/customers/models/requests/get-customer-orders';
import {CustomerBlockInfoForm} from '@app/modules/customers/models/customer-block-info-form';
import {CustomerOrder} from '@app/modules/customers/models/customer-order';
import {GetCustomerPromoHistory} from '@app/modules/customers/models/requests/get-customer-promo-history';
import {CustomerPromo} from '@app/modules/customers/models/customer-promo';
import {UpdateCustomerForm} from '@app/modules/customers/models/update-customer-form';
import {UpdateCustomerRequest} from '@app/modules/customers/models/requests/update-customer-request';
import {GetCustomerBlockRequest} from '@app/modules/customers/models/requests/get-customer-block-request';
import {CustomerBlockInfo} from '@app/modules/customers/models/customer-block-info';
import {CustomerStatusHistoryItem} from '@app/modules/customers/models/customer-status-history-item';
import {UpdateCustomerBlockRequest} from '@app/modules/customers/models/requests/update-customer-block-request';
import {AddCustomerPromoRequest} from '@app/modules/customers/models/requests/add-customer-promo-request';
import {AddCustomerPromoForm} from '@app/modules/customers/models/add-customer-promo-form';

import {ConfigResolverServiceStub} from '@testing/config-resolver-stub';
import {WebSocketServiceStub} from '@testing/websocket-service-stub';
import {UserServiceStub} from '@testing/user-service-stub';
import {TranslateServiceStub} from '@testing/translate-service-stub';

describe('CustomersService', () => {
  let websocketService: WebsocketService;
  let customersService: CustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        CustomersService,
        {provide: WebsocketService, useClass: WebSocketServiceStub}
      ]
    });
  });

  beforeEach(() => {
    websocketService = TestBed.get(WebsocketService);
    customersService = TestBed.get(CustomersService);
  });

  describe('getCustomersList', () => {
    let page;
    let sort;
    let regionId;
    let listType;

    beforeEach(() => {
      page = 2;
      sort = {
        field: CUSTOMERS_SORT_FIELDS.firstName,
        reverse: true
      };
      regionId = 'expectedRegionId';
      listType = CUSTOMERS_LIST_TYPES.active;
    });

    it('should pass correct message type into WebsocketService method to get customers list', (done) => {
      const websocketServiceSpy = spyOn(websocketService, 'send').and.returnValue(Observable.of(true));
      customersService.getCustomersList(page, sort, regionId, listType)
        .subscribe(() => {
          expect(websocketServiceSpy.calls.count()).toBe(1);
          expect(websocketServiceSpy.calls.mostRecent().args[0]).toBe(CUSTOMERS_EVENT_TYPES.GET_LIST_BY_TYPE);
          done();
        });
    });

    it('should pass correct data param into WebsocketService method to get customers list', (done) => {
      const websocketServiceSpy = spyOn(websocketService, 'send').and.returnValue(Observable.of(true));
      const expectedRequest: GetCustomersListRequest = {
        launch_region_id: regionId,
        limit: CUSTOMERS_PER_PAGE_COUNT,
        page,
        sort,
        list_name: listType
      };

      customersService.getCustomersList(page, sort, regionId, listType)
        .subscribe(() => {
          expect(websocketServiceSpy.calls.mostRecent().args[1]).toEqual(expectedRequest);
          done();
        });
    });

    it('should convert response into Customer entities', (done) => {
      const pagesCount = 10;

      const customerEntityResponse = {
        blocking_date: '2018-11-20T15:00:00Z',
        blocking_reasons: ['some reason'],
        customer_id: 'expectedId',
        first_name: 'expectedName',
        last_name: 'expectedLastName',
        first_ride_region: 'regionId',
        number_trip: 42,
        phone: '+71234567890',
        email: 'expectedEmail',
        photo: 'photo_url',
        rating: 98,
        registration_timestamp: '2018-01-10T15:22:24Z'
      };

      const expectedCustomer = new Customer();
      expectedCustomer.id = 'expectedId';
      expectedCustomer.blockingDate = '2018-11-20T15:00:00Z';
      expectedCustomer.blockingReasons = ['some reason'];
      expectedCustomer.firstName = 'expectedName';
      expectedCustomer.lastName = 'expectedLastName';
      expectedCustomer.firstRideRegion = 'regionId';
      expectedCustomer.tripsCount = 42;
      expectedCustomer.phone = '+71234567890';
      expectedCustomer.email = 'expectedEmail';
      expectedCustomer.photo = 'photo_url';
      expectedCustomer.rating = 98;
      expectedCustomer.registrationDate = '2018-01-10T15:22:24Z';

      spyOn(websocketService, 'send').and.returnValue(Observable.of({
        customers: [customerEntityResponse],
        total_pages: pagesCount
      }));

      customersService.getCustomersList(page, sort, regionId, listType).subscribe(value => {
        expect(value.data).toEqual([expectedCustomer]);
        expect(value.pagesCount).toEqual(pagesCount);
        done();
      });

    });
  });

  describe('searchCustomers', () => {
    let page;
    let sort;
    let regionId;
    let listType;
    let form;

    beforeEach(() => {
      page = 2;
      sort = {
        field: CUSTOMERS_SORT_FIELDS.firstName,
        reverse: true
      };
      regionId = 'expectedRegionId';
      listType = CUSTOMERS_LIST_TYPES.active;
      form = {
        email: 'expectedEmail',
        firstName: 'expectedFirstName',
        lastName: '',
        phone: '+71234567890',
        promoCode: 'expectedPromo'
      };
    });

    it('should pass correct message type into WebsocketService method to search customers', (done) => {
      const websocketServiceSpy = spyOn(websocketService, 'send').and.returnValue(Observable.of(true));
      customersService.searchCustomers(page, sort, regionId, form)
        .subscribe(() => {
          expect(websocketServiceSpy.calls.count()).toBe(1);
          expect(websocketServiceSpy.calls.mostRecent().args[0]).toBe(CUSTOMERS_EVENT_TYPES.SEARCH_CUSTOMERS);
          done();
        });
    });

    it('should pass correct data param into WebsocketService method to search customers', (done) => {
      const websocketServiceSpy = spyOn(websocketService, 'send').and.returnValue(Observable.of(true));
      const expectedRequest: SearchCustomersRequest = {
        first_ride_region_id: regionId,
        limit: CUSTOMERS_PER_PAGE_COUNT,
        current_page: page,
        sort,
        email: 'expectedEmail',
        first_name: 'expectedFirstName',
        phone: '+71234567890',
        promo_code: 'expectedPromo'
      };

      customersService.searchCustomers(page, sort, regionId, form)
        .subscribe(() => {
          expect(websocketServiceSpy.calls.mostRecent().args[1]).toEqual(expectedRequest);
          done();
        });
    });

    it('should convert response into Customer entities', (done) => {
      const pagesCount = 10;

      const customerEntityResponse = {
        blocking_date: '2018-11-20T15:00:00Z',
        blocking_reasons: ['some reason'],
        customer_id: 'expectedId',
        first_name: 'expectedName',
        last_name: 'expectedLastName',
        first_ride_region: 'regionId',
        number_trip: 42,
        phone: '+71234567890',
        email: 'expectedEmail',
        photo: 'photo_url',
        rating: 98,
        registration_timestamp: '2018-01-10T15:22:24Z'
      };

      const expectedCustomer = new Customer();
      expectedCustomer.id = 'expectedId';
      expectedCustomer.blockingDate = '2018-11-20T15:00:00Z';
      expectedCustomer.blockingReasons = ['some reason'];
      expectedCustomer.firstName = 'expectedName';
      expectedCustomer.lastName = 'expectedLastName';
      expectedCustomer.firstRideRegion = 'regionId';
      expectedCustomer.tripsCount = 42;
      expectedCustomer.phone = '+71234567890';
      expectedCustomer.email = 'expectedEmail';
      expectedCustomer.photo = 'photo_url';
      expectedCustomer.rating = 98;
      expectedCustomer.registrationDate = '2018-01-10T15:22:24Z';

      spyOn(websocketService, 'send').and.returnValue(Observable.of({
        customer_data_list: [customerEntityResponse],
        total_page: pagesCount
      }));

      customersService.searchCustomers(page, sort, form, listType).subscribe(value => {
        expect(value.data).toEqual([expectedCustomer]);
        expect(value.pagesCount).toEqual(pagesCount);
        done();
      });

    });
  });

});
