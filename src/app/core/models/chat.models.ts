export interface IChatRequest {
  model: string;
  messages: IMessage[];
}
export interface IMessage {
  role: string;
  content: string;
}

export class chatRequest {
  model: string;
  messages: message[];
  constructor(model: string, messages: message[]) {
    this.model = model;
    this.messages = messages;
  }
}

export class message {
  role: string;
  content: string;
  constructor(role: string, content: string) {
    this.role = role;
    this.content = content;
  }
}