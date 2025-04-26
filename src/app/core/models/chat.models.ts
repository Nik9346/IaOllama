export interface IChatRequest {
  model: string;
  messages: IMessage[];
}
export interface IMessage {
  role: string;
  content: string;
}
