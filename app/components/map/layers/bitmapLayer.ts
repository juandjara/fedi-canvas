import { TEXTURE_BOUNDS } from "@/lib/constants"
import { BitmapLayer } from "@deck.gl/layers/typed"
import GL from '@luma.gl/constants'

export type TextureData = {
  width: number
  height: number
  data: Uint8ClampedArray
}

export function getBitmapLayer(imageData: TextureData) {
  return new BitmapLayer({
    id: 'bitmap-layer',
    bounds: TEXTURE_BOUNDS,
    image: imageData,
    textureParameters: {
      [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
      [GL.TEXTURE_MAG_FILTER]: GL.NEAREST
    },
    updateTriggers: {
      image: [imageData]
    }
  })  
}
