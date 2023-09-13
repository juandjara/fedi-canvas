import { TEXTURE_LENGTH } from "./constants"
import { withRedis } from "./db.server"

export async function getCanvas() {
  const buffer = await withRedis(async redis => redis.getBuffer('canvas'))
  return buffer || new Uint8Array(TEXTURE_LENGTH)
}

export async function savePixel(x: number, y: number, color: string) {
  await fetch('/api/pixel', {
    method: 'POST',
    body: JSON.stringify({ x, y, color }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(console.error)
}
