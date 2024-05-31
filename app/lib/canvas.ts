import { TEXTURE_LENGTH } from "./constants"
import { withRedis } from "./db.server"

export async function getCanvas() {
  const dbBuffer = await withRedis(async redis => {
    const buffer = await redis.getBuffer('canvas')
    if (buffer) {
      return buffer
    } else {
      const whiteEmptyBuffer = Buffer.alloc(TEXTURE_LENGTH, 0xff)
      await redis.set('canvas', whiteEmptyBuffer)
      return whiteEmptyBuffer
    }
  })
  return dbBuffer
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
