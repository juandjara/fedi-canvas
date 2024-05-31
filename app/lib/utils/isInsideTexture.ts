import { TEXTURE_BOUNDS } from "../constants"

export default function isInsideTexture([x, y]: [number, number]) {
  return x >= TEXTURE_BOUNDS[0] && x <= TEXTURE_BOUNDS[2] && y >= TEXTURE_BOUNDS[1] && y <= TEXTURE_BOUNDS[3]
}
