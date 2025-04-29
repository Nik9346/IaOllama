import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IChatRequest } from '../models/chat.models';
import { IChatFinalResponse } from '../models/chat_response.model';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import oboe from 'oboe';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private chatSubject = new BehaviorSubject<IChatFinalResponse | null>(null);
  chat$: Observable<IChatFinalResponse | null> =
    this.chatSubject.asObservable();
  constructor(private apiService: ApiService) {}

  streamServiceChat(payload: IChatRequest): void {
    const path = '/chat'
    const options: oboe.Options = {
      url: `${this.apiService.api_url}${path}`,
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    oboe(options)
      .node('!', (data: IChatFinalResponse) => {
        this.chatSubject.next(data);
        return oboe.drop;
      })
      .done((data: IChatFinalResponse) => {
        if (data.done) {
          console.log('Chat completata');
        }
      })
      .fail((error: any) => {
        console.error('Errore nella richiesta', error);
      });
  }
}
