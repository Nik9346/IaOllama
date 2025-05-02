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
  @Output() newChatEmitter = new EventEmitter<void>();

  send() {
    if (this.inputText.nativeElement.value === '' || this.inputText.nativeElement.value === null) {
      return;
    }else{
      this.textEmitter.emit(this.inputText.nativeElement.value);
      this.inputText.nativeElement.value = '';
    }
  }

  triggerEvent(event: KeyboardEvent) {
    if(event.key === 'Enter'){
      event.preventDefault();
      this.send();
    }
  }
  newChat(){
    this.newChatEmitter.emit();
  }
  
}
