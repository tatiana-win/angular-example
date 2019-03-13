import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';

import 'rxjs/add/operator/finally';

import {Customer} from '@app/modules/customers/models/customer';
import {CustomersService} from '@app/modules/customers/services/customers.service';
import {CUSTOMERS_LIST_TYPES} from '@app/modules/customers/constants/customers-list-types';
import {SearchCustomersForm} from '@app/modules/customers/models/search-customers-form';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {

  listType: string;

  isLoading: boolean;
  isAllCustomers: boolean;
  searchForm: SearchCustomersForm = {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    promoCode: ''
  };

  page = 1;
  pagesCount: number;

  customers: Customer[];

  private queryParams: Params = {};

  constructor(private customersService: CustomersService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
  }

  /**
   * get page of customers list
   * @param {number} newPageValue
   */
  onPageChanged(newPageValue: number): void {
    this.page = newPageValue;
    this.setQueryParams();
    this.fetchCustomers();
  }

  /**
   * submit search form
   * @param {SearchCustomersForm} value
   */
  onSubmit(value: SearchCustomersForm): void {
    this.searchForm = value;
    this.page = 1;
    this.setQueryParams();
    this.fetchCustomers();
  }

  /**
   * fetch customers list
   */
  fetchCustomers(): void {
    this.isLoading = true;

    let request;

    if (this.isAllCustomers) {
      request = this.customersService.searchCustomers(this.page, this.searchForm);
    } else {
      request = this.customersService.getCustomersList(this.page, this.listType);
    }

    request
      .finally(() => this.isLoading = false)
      .subscribe({
        next: result => {
          this.customers = result.data;
          this.pagesCount = result.pagesCount;
        },
        error: err => this.toastr.error(err)
      });
  }

  /**
   * set query params into url
   */
  private setQueryParams(): void {
    this.queryParams = {
      page: `${this.page}`
    };

    if (this.isAllCustomers) {

      if (!!this.searchForm.email) {
        this.queryParams['email'] = this.searchForm.email;
      }

      if (!!this.searchForm.phone) {
        this.queryParams['phone'] = this.searchForm.phone.replace(/[^\d+]/ig, '');
      }

      if (!!this.searchForm.firstName) {
        this.queryParams['first_name'] = this.searchForm.firstName;
      }

      if (!!this.searchForm.lastName) {
        this.queryParams['last_name'] = this.searchForm.lastName;
      }

      if (!!this.searchForm.promoCode) {
        this.queryParams['promo_code'] = this.searchForm.promoCode;
      }

    }

    this.router.navigate([], {queryParams: this.queryParams});
  }

  ngOnInit() {
    this.listType = CUSTOMERS_LIST_TYPES[this.route.snapshot.params['type']];
    this.isAllCustomers = this.listType === CUSTOMERS_LIST_TYPES.all;

    this.route.queryParamMap
      .subscribe(params => {
        if (JSON.stringify(params).toLowerCase() !== JSON.stringify(this.queryParams).toLowerCase()) {
          this.page = !!params.get('page') ? Math.round(+params.get('page')) : 1;

          if (this.isAllCustomers) {
            const form = new SearchCustomersForm();
            form.email = params.get('email') || '';
            form.phone = params.get('phone') && params.get('phone').replace(/[^\d]/ig, '') || '';
            form.firstName = params.get('first_name') || '';
            form.lastName = params.get('last_name') || '';
            form.promoCode = params.get('promo_code') || '';

            this.searchForm = form;
          }
        }
      });

    this.route.paramMap
      .subscribe(params => {
        this.listType = CUSTOMERS_LIST_TYPES[params.get('type')];
        this.isAllCustomers = this.listType === CUSTOMERS_LIST_TYPES.all;
        this.fetchCustomers();
      });
  }

}
