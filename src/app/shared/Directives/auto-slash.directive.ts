import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoSlash]'
})
export class AutoSlashDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any): void {
    const input = event.target;
    const value = input.value;// Remove non-numeric characters
    const maxLength = 5; // Assuming MM/YYYY format

    if (value.length > maxLength) {
      input.value = value.slice(0, maxLength);
    }

    if (value.length >= 2 && value.length < 4) {
      input.value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } 
    
    // else if (value.length >= 4) {
    //   input.value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    // }
  }
}