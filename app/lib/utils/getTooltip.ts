import { type PickingInfo } from "@deck.gl/core/typed"
import isInsideTexture from "./isInsideTexture"

export default function getTooltip({ coordinate }: PickingInfo) {
  if (coordinate && isInsideTexture(coordinate as [number, number])) {
    const text = `${Math.floor(coordinate[0])}, ${Math.floor(coordinate[1])}`
    return {
      text,
      style: {
        margin: '12px',
        borderRadius: '4px',
        color: 'white'
      }
    }
  }
  return null
}
