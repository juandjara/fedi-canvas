import { withRedis } from "./db.server"

export async function getCanvas() {
  return withRedis(async redis => redis.getBuffer('canvas'))
}

export async function savePixel(x: number, y: number, color: string) {
  await fetch('/api/pixel', {
    method: 'POST',
    body: JSON.stringify({ x, y, color }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
