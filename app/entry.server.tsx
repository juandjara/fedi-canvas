import { PassThrough } from "stream"
import type { EntryContext } from "@remix-run/node"
import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { renderToPipeableStream } from "react-dom/server"
import isbot from "isbot"

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const UAIsBot = isbot(request.headers.get("user-agent"))
  const readyEvent = UAIsBot ? 'onAllReady' : 'onShellReady'
 
  return new Promise(async (resolve, reject) => {
    let didError = false
    const context = process.env.NODE_ENV === "development"
      ? await import("remix-development-tools").then(({ initServer }) => initServer(remixContext))
      : remixContext

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={context} url={request.url} />,
      {
        [readyEvent]: () => {
          const body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError: (err) => {
          reject(err)
        },
        onError: (error) => {
          didError = true

          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
