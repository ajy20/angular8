import { Directive, Input, ElementRef } from '@angular/core'
@Directive({
  selector: '[InputValidationDirective]',
  host: {
    '(keypress)': 'onKeypress($event)',
  }
})
export class InputValidationDirective {
  @Input('InputValidationDirective') InputValidationDirective;
  constructor(el: ElementRef) {
    el.nativeElement.setAttribute('min', 0);
    el.nativeElement.setAttribute('oninput', "validity.valid||(value='');");
  }
  onKeypress(e) {
    const limit = +this.InputValidationDirective;
    if (e.target.value.length === limit) e.preventDefault();
    if (e.which === 32 && e.target.selectionStart === 0) { return false; }
  }
}