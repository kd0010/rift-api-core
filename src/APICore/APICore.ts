import { TFetchMethod, THeaders } from '../types'
import { IAPICoreConfig, IFetchOptions, TAPIRes } from '../types/APICore'
import { is2XX, is3XX } from '../utils'

export class APICore {
  headers: string[][]
  requestCount: number
  #request: typeof fetch | (() => Promise<any>)
  constructor(
    config: IAPICoreConfig={}
  ) {
    this.headers = config.defaultHeaders ?? []
    this.requestCount = -1
    this.#request = config.fetch ?? fetch
  }

  appendHeaders(headers: THeaders) {
    this.headers = this.headers.concat(Object.entries(headers))
  }

  /**
   * If enabled, will `console.log` request amounts.
   */
  enableRequestCounting() {
    this.requestCount = 0
  }

  async _fetch<TRes, TReq>(
    baseUrl: string,
    method?: TFetchMethod,
    {
      body,
      query,
    }: IFetchOptions<TReq>={}
  ): Promise<TAPIRes<TRes>> {
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
      const res = await this.#request(baseUrl, {
        headers: this.headers,
        method: method,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!(is2XX(res.status) || is3XX(res.status))) {
        console.error(`Non-200/-300 status code encountered:  ${res.status}`)
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
      console.error(e)
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
