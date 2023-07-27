import { OrthographicView, type PickingInfo } from '@deck.gl/core/typed'
import { DeckGL } from '@deck.gl/react/typed'
import { useMemo, useState } from 'react'
import { useLoaderData } from '@remix-run/react'
import ColorPicker from '../ColorPicker'
import hexToRgb from '@/lib/utils/hexToRgb'
import isInsideTexture from '@/lib/utils/isInsideTexture'
import { CANVAS_HEIGHT, CANVAS_WIDTH, TEXTURE_LENGTH } from '@/lib/constants'
import getColorIndex from '@/lib/utils/getColorIndex'
import clampToTexture from '@/lib/utils/clampToTexture'
import { savePixel } from '@/lib/canvas'
import { getBitmapLayer, type TextureData } from './layers/bitmapLayer'
import { getCrosshairLayer } from './layers/crosshairLayer'
import getTooltip from '@/lib/utils/getTooltip'
import ActionButton from './ActionButton'

type ViewState = {
  target: [number, number]
  zoom: number
  minZoom?: number
  maxZoom?: number
}

export default function MapContainer() {
  const { data } = useLoaderData()
  const [color, setColor] = useState('#ffffff')
  const [viewState, setViewState] = useState<ViewState>({
    target: [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2],
    zoom: 1, // zoom is relative to pixel size
    maxZoom: 5
  })

  const [imageData, setImageData] = useState<TextureData>(() => {
    const arr = data
      .slice(0, TEXTURE_LENGTH) // if canvas is smaller than saved data, cut data to canvas size
      .concat(
        TEXTURE_LENGTH > data.length // if canvas is bigger than saved data, fill the gaps with white pixels
          ? Array.from({ length: TEXTURE_LENGTH - data.length }, () => 255)
          : []
      )

    return {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      data: new Uint8ClampedArray(arr)
    }
  })

  function drawPixel(x: number, y: number, color: string) {
    const index = getColorIndex(x, y)
    const [r, g, b] = hexToRgb(color)
    imageData.data[index] = r
    imageData.data[index + 1] = g
    imageData.data[index + 2] = b

    // force redraw of bitmap layer
    setImageData(d => ({ ...d }))
  }

  const center = useMemo(() => {
    return clampToTexture([
      Math.floor(viewState.target[0]),
      Math.floor(viewState.target[1])
    ])
  }, [viewState.target])

  function onMapClick({ coordinate }: PickingInfo) {
    if (coordinate && isInsideTexture(coordinate as [number, number])) {
      const [x, y] = coordinate as [number, number]
      setViewState((viewState) => ({
        ...viewState,
        zoom: 4.20,
        target: [x, y],
        transitionDuration: 500,
      }))
    }
  }

  async function onCTAClick() {
    await savePixel(center[0], center[1], color)
    drawPixel(center[0], center[1], color)
  }

  return (
    <div className='overflow-hidden w-full h-screen absolute inset-0 bg-gray-200'>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as ViewState)}
        controller={true}
        layers={[
          getBitmapLayer(imageData),
          getCrosshairLayer({ center, color })
        ]}
        views={[
          new OrthographicView({
            flipY: false,
          })
        ]}
        getTooltip={getTooltip}
        onClick={onMapClick}
      />
      <div className='m-4 fixed bottom-0 inset-x-0 flex flex-col gap-4 items-center'>
        <ActionButton
          x={center[0]}
          y={center[1]}
          z={viewState.zoom}
          onClick={onCTAClick}
        />
        <ColorPicker color={color} setColor={setColor} />
      </div>
    </div>
  ) 
}
