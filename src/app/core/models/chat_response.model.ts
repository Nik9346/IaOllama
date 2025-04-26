import { IMessage } from "./chat.models"

export interface IChatFinalResponse {
    model: string
  created_at: string
  message: IMessage
  done: boolean
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}