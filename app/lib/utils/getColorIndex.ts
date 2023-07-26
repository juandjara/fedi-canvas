import { CANVAS_WIDTH, COLOR_CHANNELS } from "../constants"

export default function getColorIndex(x: number, y: number, width: number = CANVAS_WIDTH, height: number = CANVAS_WIDTH) {
  const index = COLOR_CHANNELS * ((height - 1 - y) * width + x)
  return index
}