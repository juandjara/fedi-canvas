import { withRedis } from "@/lib/db.server"
import getColorIndex from "@/lib/utils/getColorIndex"
import hexToRgb from "@/lib/utils/hexToRgb"
import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const { x, y, color } = await request.json()
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
