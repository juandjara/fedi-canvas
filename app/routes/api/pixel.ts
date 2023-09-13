import { withRedis } from "@/lib/db.server"
import getColorIndex from "@/lib/utils/getColorIndex"
import hexToRgb from "@/lib/utils/hexToRgb"
import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const { x, y, color } = await request.json()
  if (typeof x !== 'number') {
    return new Response('Invalid input. x in json body should be a number', { status: 400 })
  }
  if (typeof y !== 'number') {
    return new Response('Invalid input. y in json body should be a number', { status: 400 })
  }
  if (typeof color !== 'string') {
    return new Response('Invalid input. color in json body should be a string', { status: 400 })
  }

  // TODO: validate user

  return withRedis(async redis => {
    const index = getColorIndex(x, y)
    const [r, g, b] = hexToRgb(color)
    return redis.pipeline()
      .bitfield('canvas', 'SET', 'u8', `#${index + 0}`, r)
      .bitfield('canvas', 'SET', 'u8', `#${index + 1}`, g)
      .bitfield('canvas', 'SET', 'u8', `#${index + 2}`, b)
      .bitfield('canvas', 'SET', 'u8', `#${index + 3}`, 255)
      .exec()
  })
}
