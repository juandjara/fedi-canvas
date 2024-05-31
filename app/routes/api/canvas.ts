import { getCanvas } from '@/lib/canvas'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/constants'
import { type LoaderFunction } from '@remix-run/node'
import Jimp from 'jimp'

// TODO: add caching

export const loader: LoaderFunction = async () => {
  const dbBuf = await getCanvas()
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
