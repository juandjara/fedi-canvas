import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    )
  })
}

function main() {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(hydrate)
  } else {
    // Safari doesn't support requestIdleCallback
    // https://caniuse.com/requestidlecallback
    setTimeout(hydrate, 1)
  }
}

if(process.env.NODE_ENV === "development") {
  import('remix-development-tools').then(({ initClient }) => {
    initClient()
    main()
  })
} else {
  main()
}
