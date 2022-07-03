import { FetchingFunction, Headers, Method } from '.'

export interface APICoreConfig {
  fetch?: FetchingFunction
}

export interface RequestInit {
  headers: Headers
  method?: string
  body?: string
}

export interface FetchOptions<T> {
  method?: Method
  query?: Query
  body?: T
}

export interface Query {
  [k: string]: string
}
