import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {IntegerInputDirective} from './integer-input.directive';

describe('IntegerInputDirective', () => {
  it('should create an instance', () => {
    const directive = new IntegerInputDirective();
    expect(directive).toBeTruthy();
  });

  describe('directive that doesn\'t allow negative', () => {
    @Component({
      template: `
        <input
          [(ngModel)]="inputValue"
          appIntegerInput
        />
      `
    })
    class TestHostComponent {
      inputValue = '';
    }

    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          TestHostComponent,
          IntegerInputDirective
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set in inputValue exact value that was typed', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = '90';
      input.dispatchEvent(new Event('input'));

      expect(component.inputValue).toBe('90');
    });

    it('should set in inputValue value without non-digits symbols', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = '90.9e.0';
      input.dispatchEvent(new Event('input'));

      expect(component.inputValue).toBe('9090');
    });

    it('should set in inputValue value without dash', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = '-8765';
      input.dispatchEvent(new Event('input'));

      expect(component.inputValue).toBe('8765');
    });
  });

  describe('directive that allows negative', () => {
    // tslint:disable-next-line
    @Component({
      template: `
        <input
          [(ngModel)]="inputValue"
          [allowNegative]="true"
          appIntegerInput
        />
      `
    })
    class TestHostComponent {
      inputValue = '';
    }

    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          TestHostComponent,
          IntegerInputDirective
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set in inputValue value without non-digits symbols', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = '90.9e.0';
      input.dispatchEvent(new Event('input'));

      expect(component.inputValue).toBe('9090');
    });

    it('should set in inputValue value without non-digits symbols', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = '-8765';
      input.dispatchEvent(new Event('input'));

      expect(component.inputValue).toBe('-8765');
    });
  });
});
