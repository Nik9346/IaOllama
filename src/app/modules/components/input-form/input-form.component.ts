import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-input-form',
  imports: [],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss',
})
export class InputFormComponent {
  @ViewChild('inputText') inputText: ElementRef;

  @Output() textEmitter = new EventEmitter<string>();

  send() {
    this.textEmitter.emit(this.inputText.nativeElement.value);
    this.inputText.nativeElement.value = '';
  }
  
}
