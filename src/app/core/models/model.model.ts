import { IDetails } from "./details.model"

export interface IModel {
    name: string
    model: string
    size: number
    digest: string
    details: IDetails
    expires_at: string
    size_vram: number
  }