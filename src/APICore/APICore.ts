import { APIRes, FetchingFunction, Headers } from '../types'
import { APICoreConfig, FetchOptions } from '../types/Interfaces'
import { is2XX, is3XX } from '../utils'

export class APICore {
  headers: Headers
  requestCount: number
  #alternativeRequestFn: FetchingFunction | null
  constructor(
    config: APICoreConfig={}
  ) {
    this.headers = []
    this.requestCount = -1
    this.#alternativeRequestFn = config.fetch ?? null
  }

  appendHeaders(headers: Headers) {
    for (let headerName in headers) {
      this.headers[headerName] = headers[headerName]!
    }
  }

  /**
   * If enabled, will `console.log` request amounts.
   */
  enableRequestCounting() {
    this.requestCount = 0
  }

  async _fetch<Res, Req>(
    baseUrl: string,
    {
      method,
      query,
      body,
    }: FetchOptions<Req>={}
  ): Promise<APIRes<Res>> {
    if (this.requestCount != -1) {
      ++this.requestCount
      // Print requests with # of 1, 2, 4, 6, ...
      if (this.requestCount % 2 == 0 || this.requestCount == 1) {
        console.log('Request #' + this.requestCount)
      }
    }

    if (query) {
      let params = new URLSearchParams(query).toString()
      baseUrl += params ? '?' + params : ''
    }

    try {
      const request = this.#alternativeRequestFn ?? fetch
      const res = await request(baseUrl, {
        headers: this.headers,
        method: method,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!(is2XX(res.status) || is3XX(res.status))) {
        // DEV
        // console.error(`Non-200/-300 status code encountered:  ${res.status}`)
        return {
          ok: false,
          data: await res.json() as unknown,
          status: res.status,
        }
      }

      return {
        ok: true,
        data: await res.json(),
        status: res.status,
      }
    } catch (e) {
      // DEV
      // console.error(e)
      return {
        ok: false,
        data: null,
        status: 400,
      }
    }
  }

  _createError(msg: string) {
    return new Error(msg)
  }
}
