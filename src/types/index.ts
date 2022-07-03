import { RequestInit } from './Interfaces'

export type Method =
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT'

export type APIRes<T> = {
  ok: true
  data: T
  status: number
} | {
  ok: false
  data: null
  status: 400
} | {
  ok: false
  data: unknown
  status: number
}

export type FetchingFunction = (
  url: string,
  init: RequestInit,
) => Promise<{
  status: number
  json: () => Promise<any>
}>

export type Headers = string[][]
