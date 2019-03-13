import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {TranslateModule} from '@ngx-translate/core';
import {TextMaskModule} from 'angular2-text-mask';

import {SearchCustomersFormComponent} from './search-customers-form.component';

describe('SearchCustomersComponent', () => {
  let component: SearchCustomersFormComponent;
  let fixture: ComponentFixture<SearchCustomersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        TextMaskModule
      ],
      declarations: [
        SearchCustomersFormComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCustomersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      component.form.setValue(formValue);
    });

    it('should emit form submitted if submit button is pressed', (done) => {
      component.formSubmitted.subscribe(() => {
        done();
      });
      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      button.click();
    });

  });

  describe('template', () => {
    it('should reflect email input changes into form value', () => {
      const expectedValue = 'some email';
      const input = fixture.debugElement.query(By.css('input#email')).nativeElement;

      input.value = expectedValue;
      input.dispatchEvent(new Event('input'));

      expect(component.form.get('email').value).toBe(expectedValue);
    });

    it('should reflect phone input changes into form value', () => {
      const expectedValue = '+1 (234) 567-89-00';
      const input = fixture.debugElement.query(By.css('input#phone')).nativeElement;

      input.value = expectedValue;
      input.dispatchEvent(new Event('input'));

      expect(component.form.get('phone').value).toBe(expectedValue);
    });

    it('should reflect first name input changes into form value', () => {
      const expectedValue = 'some first name';
      const input = fixture.debugElement.query(By.css('input#first-name')).nativeElement;

      input.value = expectedValue;
      input.dispatchEvent(new Event('input'));

      expect(component.form.get('firstName').value).toBe(expectedValue);
    });

    it('should reflect last name input changes into form value', () => {
      const expectedValue = 'some last name';
      const input = fixture.debugElement.query(By.css('input#last-name')).nativeElement;

      input.value = expectedValue;
      input.dispatchEvent(new Event('input'));

      expect(component.form.get('lastName').value).toBe(expectedValue);
    });

    it('should reflect promo code input changes into form value', () => {
      const expectedValue = 'some promo code';
      const input = fixture.debugElement.query(By.css('input#promo-code')).nativeElement;

      input.value = expectedValue;
      input.dispatchEvent(new Event('input'));

      expect(component.form.get('promoCode').value).toBe(expectedValue);
    });
  });
});
