import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-auto-complete',
  templateUrl: './custom-auto-complete.component.html',
  styleUrls: ['./custom-auto-complete.component.scss'],
})
export class CustomAutoCompleteComponent {
  private _selectedValue: string;
  @Input() suggestions: any[];
  @Input() field: string;
  @Input() minLength: number;
  @Output() completeMethod: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedValueChange: EventEmitter<string> = new EventEmitter<string>();

  filterValues(event: any) {
    const value = event.target.value;
    if (value.length >= this.minLength) {
      this.completeMethod.emit(value);
    }
  }

  onValueSelect(event: any) {
    this.selectedValue = event.target.textContent.trim();
    this.onSelect.emit(this.selectedValue);
  }

  get selectedValue(): string {
    return this._selectedValue;
  }

  @Input()
  set selectedValue(value: string) {
    this._selectedValue = value;
    this.selectedValueChange.emit(value);
  }
}
