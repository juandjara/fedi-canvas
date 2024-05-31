import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants"

export default function clampToTexture([x, y]: [number, number]) {
  return [
    Math.max(0, Math.min(x, CANVAS_WIDTH - 1)),
    Math.max(0, Math.min(y, CANVAS_HEIGHT - 1))
  ] as [number, number]
}
