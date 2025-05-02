import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { InputFormComponent } from "../../components/input-form/input-form.component";
import { ApiService } from "../../../core/services/api.service";
import { IRequest } from "../../../core/models/request.model";
import { IResponse } from "../../../core/models/response.model";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { ChatApiService } from "../../../core/services/chat-api.service";
import { MarkdownModule, MarkdownService } from "ngx-markdown";


import {
  chatRequest,
  IChatRequest,
  IMessage,
  message,
} from "../../../core/models/chat.models";
import { IChatFinalResponse } from "../../../core/models/chat_response.model";
import oboe from "oboe";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ModelService } from "../../../core/services/model.service";
import { IModel } from "../../../core/models/model.model";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { NgClass } from "@angular/common";
import { LocalStorageService } from "../../../core/services/local-storage.service";

@Component({
  selector: "app-home-page",
  imports: [
    InputFormComponent,
    LoadingSpinnerComponent,
    NavbarComponent,
    SidenavComponent,
    NgClass,
    MarkdownModule,
  ],
  providers: [MarkdownService],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
})
export class HomePageComponent implements OnInit {
  isLoading: boolean = false;
  error: boolean = false;
  textRequest: string = undefined;
  models: IModel[] = [];
  modelSelected: string = "qwen2.5";
  messagesArray: IChatRequest;
  currentStreamingMessage: IMessage = null;
  historyMaxLength: number = 5;

  constructor(
    private chatService: ChatApiService,
    private modelService: ModelService,
    private localeStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    //Inizializza il servizio di chat
    this.chatService.chat$.subscribe((data: IChatFinalResponse) => {
      if (data) {
        if (!this.currentStreamingMessage) {
          this.currentStreamingMessage = {
            role: data.message.role,
            content: "",
          };
          this.messagesArray.messages.push(this.currentStreamingMessage);
        }
      }
      this.currentStreamingMessage.content += data.message.content;
      //al completamento del messaggio imposta la variabile di streaming a null
      if (data.done) this.currentStreamingMessage = null;
      this.localeStorageService.saveData(
        this.localeStorageService.getToken(),
        this.messagesArray
      );
      //fa un controllo sulla lunghezza dell'array che viene passato ad ogni chiamata, se questo supera la lunghezza massima rimuove il primo elemento
      if (this.messagesArray.messages.length > this.historyMaxLength)
        this.messagesArray.messages.shift();
    });
    //Carica il modello di default
    this.modelService
      .loadDefaultModel({ model: this.modelSelected })
      .subscribe((data) => data);
    this.modelService.getDefaultModel().subscribe((data) =>
      data.models.map((data) => {
        data.name = data.name.replace(":latest", "");
        this.modelSelected = data.name;
      })
    );
    //Carica i modelli disponibili
    this.modelService.getModelAvailable().subscribe((data) =>
      data.models.map((model) => {
        model.name = model.name.replace(":latest", "");
        this.models.push(model);
      })
    );
    let history = this.localeStorageService.getData(
      this.localeStorageService.getToken()
    );
    if (history) this.messagesArray = history;
    this.localeStorageService.setToken();
  }
  //chiamata al servizio di chat
  //viene passato l'oggetto messagesArray che contiene il messaggio dell'utente e il modello selezionato
  callIA(event: string) {
    if (this.messagesArray === undefined) {
      this.messagesArray = new chatRequest(this.modelSelected, [
        { role: "user", content: event },
      ]);
    } else {
      let newMex: IMessage = new message("user", event);
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

  newChat(): void{
    this.localeStorageService.deleteData(this.localeStorageService.getToken());
    this.messagesArray = undefined;
  }
}
