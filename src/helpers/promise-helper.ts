export const promiseHelper = {
  delay: (miniseconds: number) => new Promise((resolve) => setTimeout(resolve, miniseconds)),
  handle: (promise: any) => promise.then((res) => [undefined, res]).catch((err) => [err, undefined]),
}
