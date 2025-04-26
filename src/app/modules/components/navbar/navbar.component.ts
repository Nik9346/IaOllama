import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModel } from '../../../core/models/model.model'; 
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [UpperCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() models: IModel[];
  @Input() modelSelected: string;
  @Output() modelSelectedChange: EventEmitter<string> = new EventEmitter<string>();
  
  onSelectChange(event:any){
    const select = (event.target as HTMLSelectElement).value
    this.modelSelectedChange.emit(select);
  }


}

