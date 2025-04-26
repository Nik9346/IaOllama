import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InputFormComponent } from '../../components/input-form/input-form.component';
import { ApiService } from '../../../core/services/api.service';
import { IRequest } from '../../../core/models/request.model';
import { IResponse } from '../../../core/models/response.model';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { catchError, map } from 'rxjs';
import { ChatApiService } from '../../../core/services/chat-api.service';
import { IChatRequest, IMessage } from '../../../core/models/chat.models';
import { IChatFinalResponse } from '../../../core/models/chat_response.model';
import oboe from 'oboe';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ModelService } from '../../../core/services/model.service';
import { IModel } from '../../../core/models/model.model';
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [InputFormComponent, LoadingSpinnerComponent, NavbarComponent, SidenavComponent, NgClass],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  response: string = '';
  isLoading: boolean = false;
  error: boolean = false;
  streamData: any[] = [];
  stringArray: string = undefined;
  textRequest: string = undefined;
  models: IModel[] = [];
  modelSelected: string = 'mistral';
  messagesArray: IChatRequest;

  constructor(
    private chatService: ChatApiService,
    private modelService: ModelService
  ) { }
  ngOnInit(): void {
    this.chatService.chat$.subscribe((data: IChatFinalResponse) => {
      if (data) {
        this.streamData.push(data.message.content);
        this.stringArray = this.streamData.join('');
        if (data.done) {
          console.log(data.done);
          let newMex: IMessage = {
            role: data.message.role,
            content: this.stringArray
          }
          this.messagesArray.messages.push(newMex);
          console.log(this.messagesArray);
        }
      }
    });
    this.modelService
      .loadDefaultModel({ model: this.modelSelected })
      .subscribe((data) => console.log(data));
    this.modelService
      .getDefaultModel()
      .subscribe((data) =>
        data.models.map((data) => {
          data.name = data.name.replace(':latest', '');
          this.modelSelected = data.name;
        })
      );

    this.modelService.getModelAvailable().subscribe((data) =>
      data.models.map((model) => {
        model.name = model.name.replace(':latest', '');
        this.models.push(model);
      })
    );
  }

  callIA(event: string) {
    this.textRequest = event;
    this.streamData = [];
    if (this.messagesArray === undefined) {
      this.messagesArray = {
        model: this.modelSelected,
        messages: [
          {
            role: 'user',
            content: event,
          },
        ],
      };
    }else{
      let newMex : IMessage = {
        role:'user',
        content:event
      }
      this.messagesArray.messages.push(newMex);
    }
    this.isLoading = true;
    this.chatService.streamServiceChat(this.messagesArray);
  }

  changeSelectedModel(event: string): void {
    this.modelSelected = event;
    console.log(this.modelSelected);
    this.messagesArray = undefined;
  }
}
