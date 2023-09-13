import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/constants'
import { withRedis } from '@/lib/db.server'
import { type LoaderFunction } from '@remix-run/node'
import Jimp from 'jimp'

export const loader: LoaderFunction = async () => {
  const dbBuf = await withRedis(async redis => redis.getBuffer('canvas'))
  if (dbBuf) {
    const img = await Jimp.create(CANVAS_WIDTH, CANVAS_HEIGHT, 0xffffffff)
    img.bitmap.data.set(dbBuf)

    const imgBuf = await img.getBufferAsync(Jimp.MIME_PNG)
    return new Response(imgBuf, {
      headers: {
        'Content-Type': 'image/png'
      }
    })
  } else {
    return new Response('image buffer not found in db', {
      status: 404
    })
  }
}
