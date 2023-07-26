import MapFallback from "@/components/map/MapFallback"
import MapTopLeft from "@/components/map/MapTopLeft"
import { getCanvas } from "@/lib/canvas"
import type { LoaderFunction } from "@remix-run/node"
import { lazy } from "react"
import { ClientOnly } from "remix-utils"

const Map = lazy(() => import('@/components/map/Map'))

export const loader: LoaderFunction = async ({ params, request }) => {
  const data = await getCanvas()
  return data
}

export default function Index() {
  return (
    <div className="flex relative w-full">
      <MapTopLeft />
      <ClientOnly fallback={<MapFallback />}>{() => <Map />}</ClientOnly>
    </div>
  )
}
