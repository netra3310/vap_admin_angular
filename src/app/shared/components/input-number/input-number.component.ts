import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() prefix: string;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() mode: string;
  @Input() minFractionDigits: number;
  @Input() maxFractionDigits: number;

  value: number | null;

  onChange: (value: number | null) => void;
  onTouched: () => void;

  writeValue(value: number) {
    this.value = value;
  }

  registerOnChange(onChange: (value: number | null) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  onInput(event: Event) {
    const inputValue = (<HTMLInputElement>event.target).value;
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      this.value = parsedValue;
      this.onChange(parsedValue);
    } else {
      this.value = null;
      this.onChange(null);
    }
  }
}
