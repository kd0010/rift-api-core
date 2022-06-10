import { TQuery } from '.'

export interface IAPICoreConfig {
  defaultHeaders?: string[][],
}

export type TAPIRes<T> = {
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

export interface IFetchOptions<T> {
  body?: T
  query?: TQuery
}
