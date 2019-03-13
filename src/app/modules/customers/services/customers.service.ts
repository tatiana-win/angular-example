import {Injectable} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {plainToClass} from 'class-transformer';

import {Observable} from 'rxjs/Observable';

import {WebsocketService} from '@app/modules/core';
import {LaunchRegion} from '@app/modules/shared';
import {GetCustomersListRequest} from '@app/modules/customers/models/requests/get-customers-list-request';
import {Customer} from '@app/modules/customers/models/customer';
import {SearchCustomersForm} from '@app/modules/customers/models/search-customers-form';
import {SearchCustomersRequest} from '@app/modules/customers/models/requests/search-customers-request';

export const CUSTOMERS_PER_PAGE_COUNT = 15;

export const CUSTOMERS_EVENT_TYPES = {
    SEARCH_CUSTOMERS: 'MANAGER_SEARCH_CUSTOMER_REQ',
    GET_LIST_BY_TYPE: 'MANAGER_GET_CUSTOMERS_LIST_REQ',
};

@Injectable()
export class CustomersService {

    constructor(private websocketService: WebsocketService) {
    }

    /**
     * get customers list
     * @param {number} page
     * @param {{field: string, reverse: boolean}} sort
     * @param {string} regionId
     * @param {string} listType
     * @return {Observable<Customer[]>}
     */
    getCustomersList(page: number, sort: any, regionId: string, listType: string): Observable<{ data: Customer[], pagesCount: number }> {
        const data: GetCustomersListRequest = {
            launch_region_id: regionId,
            limit: CUSTOMERS_PER_PAGE_COUNT,
            page,
            sort,
            list_name: listType
        };

        return this.websocketService.send(CUSTOMERS_EVENT_TYPES.GET_LIST_BY_TYPE, data)
            .map((response) => {
                return {
                    data: plainToClass(Customer, response.customers),
                    pagesCount: response.total_pages
                };
            });
    }

    /**
     * search customers
     * @param {number} page
     * @param {{field: string, reverse: boolean}} sort
     * @param {string} region
     * @param {SearchCustomersForm} form
     * @return {Observable<Customer[]>}
     */
    searchCustomers(page: number, sort: any, region: string, form: SearchCustomersForm): Observable<{ data: Customer[], pagesCount: number }> {
        const data: SearchCustomersRequest = {
            first_ride_region_id: region,
            limit: CUSTOMERS_PER_PAGE_COUNT,
            current_page: page,
            sort
        };

        if (!!form.email) {
            data.email = form.email;
        }

        if (!!form.phone) {
            data.phone = `+${form.phone.replace(/[^\d]/ig, '')}`;
        }

        if (!!form.firstName) {
            data.first_name = form.firstName;
        }

        if (!!form.lastName) {
            data.last_name = form.lastName;
        }

        if (!!form.promoCode) {
            data.promo_code = form.promoCode;
        }

        return this.websocketService.send(CUSTOMERS_EVENT_TYPES.SEARCH_CUSTOMERS)
            .map((response) => {
                return {
                    data: plainToClass(Customer, response.customer_data_list),
                    pagesCount: response.total_page
                };
            });
    }
}
