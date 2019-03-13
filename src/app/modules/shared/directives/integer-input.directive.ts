import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[integerInput]'
})
export class IntegerInputDirective {

  @Input()
  allowNegative = false;

  @HostListener('input', ['$event']) onKeyPressed($event) {
    const regexp = this.allowNegative ? /^-?\d+$/ : /^\d+$/;

    if (!!$event.target.value && !regexp.test($event.target.value)) {
      const isNegative = /^-/.test($event.target.value);
      const correctValue = $event.target.value.replace(/[^\d]/g, '');
      $event.target.value = `${isNegative && this.allowNegative ? '-' : ''}${correctValue}`;
      $event.target.dispatchEvent(new Event('input'));
    }
  }

  constructor() { }

}
