import MapFallback from "@/components/map/MapFallback"
import MapTopLeft from "@/components/map/MapTopLeft"
import { lazy } from "react"
import { ClientOnly } from "remix-utils"

const Map = lazy(() => import('@/components/map/Map'))

export default function Index() {
  return (
    <div className="flex relative w-full">
      <MapTopLeft />
      <ClientOnly fallback={<MapFallback />}>{() => <Map />}</ClientOnly>
    </div>
  )
}
