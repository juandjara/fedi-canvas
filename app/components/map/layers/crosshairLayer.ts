import hexToRgb from "@/lib/utils/hexToRgb"
import { PolygonLayer } from "@deck.gl/layers/typed"

export function getCrosshairLayer({ center, color }: { center: [number, number], color: string }) {
  return new PolygonLayer({
    id: 'crosshair-layer',
    data: [
      {
        // 1px square placed at crosshair position (center of the viewport)
        polygon: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
        ].map(([x, y]) => [x + center[0], y  + center[1]])
      }
    ],
    lineWidthUnits: 'pixels',
    getLineWidth: 2,
    getPolygon: (d) => d.polygon,
    getFillColor: hexToRgb(color),
    getLineColor: [0, 0, 0, 255],
    stroked: true,
    filled: true,
  })
}
