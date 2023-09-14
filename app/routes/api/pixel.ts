import { WAIT_TIME } from "@/lib/constants"
import { withRedis } from "@/lib/db.server"
import getColorIndex from "@/lib/utils/getColorIndex"
import hexToRgb from "@/lib/utils/hexToRgb"
import type { ActionFunction } from "@remix-run/node"
import { jwtVerify } from "jose"

const secretEnv = process.env.JWT_SECRET
const JWT_SECRET = secretEnv ? new TextEncoder().encode(secretEnv) : null
const BOT_AGENT = 'FediCanvas bot v0.0.1'

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

  if (!JWT_SECRET) {
    return new Response('JWT_SECRET is not set', { status: 500 })
  }

  const jwt = (request.headers.get('Authorization') || '').split(' ')[1]
  if (!jwt) {
    return new Response('Authorization header is missing', { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(jwt, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: BOT_AGENT
    })
    const user = payload.sub
    return withRedis(async redis => {
      const lastTimeText = await redis.get(`time:${user}`)
      const lastTime = Number(lastTimeText)
      if (lastTime) {
        const now = Date.now()
        const diff = now - lastTime
        if (diff < WAIT_TIME) {
          return new Response(
            JSON.stringify({
              message: 'Too many requests',
              lastTime,
            }),
            { status: 429 }
          )
        }
      }

      await redis.setex(`time:${user}`, WAIT_TIME / 1000, Date.now())

      const index = getColorIndex(x, y)
      const [r, g, b] = hexToRgb(color)
      return redis.pipeline()
        .bitfield('canvas', 'SET', 'u8', `#${index + 0}`, r)
        .bitfield('canvas', 'SET', 'u8', `#${index + 1}`, g)
        .bitfield('canvas', 'SET', 'u8', `#${index + 2}`, b)
        .bitfield('canvas', 'SET', 'u8', `#${index + 3}`, 255)
        .exec()
    })
  } catch (err) {
    return new Response('Invalid JWT', { status: 401 })
  }
}
