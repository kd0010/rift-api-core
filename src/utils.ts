export function is2XX(status: number): boolean {
  return status.toString()[ 0 ] == '2'
}

export function is3XX(status: number): boolean {
  return status.toString()[ 0 ] == '3'
}

/**
 * A function that allows to process multiple items at the same time,
 * but not all of them at once – so in batches instead.
 * 
 * Works with the assumption that all promises resolve and none reject
 * whilst calling the `onItem` parameter.
 */
export async function useBatches<T>(
  data: T[],
  onItem: (item: T) => Promise<void>,
  batchSize=5,
  /**
   * Milliseconds.
   */
  waitTime=300,
) {
  let currentIdx = 0

  while (currentIdx < data.length) {
    let promisesBatch: Promise<void>[] = []
    for (let i = 0; i < batchSize && currentIdx < data.length; ++i) {
      promisesBatch.push(onItem(data[ currentIdx ]!))
      ++currentIdx
    }
    await Promise.all(promisesBatch)
    // Wait some time before processing the next batch
    await new Promise(r => setTimeout(r, waitTime))
  }
}
