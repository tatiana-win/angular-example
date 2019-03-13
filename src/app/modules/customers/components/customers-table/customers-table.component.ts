import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Customer} from '@app/modules/customers/models/customer';
import {CUSTOMERS_LIST_TYPES} from '@app/modules/customers/constants/customers-list-types';
import {BlockCustomerComponent} from '@app/modules/customers/components/block-customer/block-customer.component';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css']
})
export class CustomersTableComponent {

  @Input()
  customers: Customer[] = [];

  @Input()
  listType: string;

  @Output()
  listChanged = new EventEmitter<void>();

  constructor(private modalService: NgbModal) {
  }

  /**
   * is blocked customers list
   * @return {boolean}
   */
  isBlockedCustomers(): boolean {
    return this.listType === CUSTOMERS_LIST_TYPES.blocked;
  }

  /**
   * unblock customer
   * @param customer
   */
  unblock(customer: Customer): void {
    const modalRef = this.modalService.open(BlockCustomerComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.customer = customer;

    modalRef.result
      .then(() => this.listChanged.emit())
      .catch(() => {});
  }
}
