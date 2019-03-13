import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {SearchCustomersForm} from '@app/modules/customers/models/search-customers-form';
import {PHONE_MASK} from '@app/modules/shared';

@Component({
  selector: 'app-search-customers-form',
  templateUrl: './search-customers-form.component.html',
  styleUrls: ['./search-customers-form.component.css']
})
export class SearchCustomersFormComponent implements OnInit, AfterViewInit {

  @Input()
  formValue = new SearchCustomersForm();

  @Output()
  formSubmitted = new EventEmitter<SearchCustomersForm>();

  @ViewChild('phoneInput')
  phoneInput: ElementRef;

  form: FormGroup;

  phoneMask = PHONE_MASK;

  constructor(private fb: FormBuilder) {
  }

  /**
   * form initialization
   */
  private initForm(): void {
    this.form = this.fb.group({
      email: new FormControl(this.formValue.email || ''),
      phone: new FormControl(this.formValue.phone || ''),
      firstName: new FormControl(this.formValue.firstName || ''),
      lastName: new FormControl(this.formValue.lastName || ''),
      promoCode: new FormControl(this.formValue.promoCode || '')
    });
  }

  /**
   * search customers
   */
  onSubmit(): void {
    this.formSubmitted.emit(this.form.value);
  }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.phoneInput.nativeElement.focus();
  }

}
