import { OrthographicView } from '@deck.gl/core/typed'
import { DeckGL } from '@deck.gl/react/typed'
import { BitmapLayer, SolidPolygonLayer } from '@deck.gl/layers/typed'
import GL from '@luma.gl/constants'
import { useEffect, useMemo, useState } from 'react'

const CANVAS_SIZE = 500
const TEXTURE_BOUNDS = [0, 0, CANVAS_SIZE, CANVAS_SIZE] as [number, number, number, number]

type ViewState = {
  target: [number, number]
  zoom: number
  minZoom?: number
  maxZoom?: number
}

type TextureData = {
  width: number
  height: number
  data: Uint8ClampedArray
}

export default function MapContainer() {
  const [imageData, setImageData] = useState<TextureData | null>(null)
  const [viewState, setViewState] = useState<ViewState>({
    target: [CANVAS_SIZE / 2, CANVAS_SIZE / 2],
    zoom: 0, // zoom is relative to pixel size
    // minZoom: 0,
    maxZoom: 5
  })
  const [color, setColor] = useState('#ffffff')

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setImageData({
        width: data.width,
        height: data.height,
        data: new Uint8ClampedArray(data.data)
      })
    }
    img.crossOrigin = "anonymous"
    img.src = '/texture.png'
  }, [])

  function modifyImageData(x: number, y: number, color: string) {
    const { width, height, data } = imageData!
    createImageBitmap(new ImageData(data, width, height)).then((imageBitmap) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(imageBitmap, 0, 0)
      ctx.fillStyle = color
      ctx.fillRect(x, height - 1 - y, 1, 1)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setImageData({
        width: data.width,
        height: data.height,
        data: new Uint8ClampedArray(data.data)
      })
    })
  }

  const cursor = useMemo(() => {
    const [x, y] = viewState.target
    return isInsideTexture([x, y]) ? [Math.floor(x), Math.floor(y)] : null
  }, [viewState.target])

  const zoomDisplay = useMemo(() => {
    return Math.round(2 ** viewState.zoom * 10) / 10
  }, [viewState.zoom])

  const bitmap = imageData && new BitmapLayer({
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
  const polygon = cursor && new SolidPolygonLayer({
    id: 'cursor-layer',
    data: [
      {
        polygon: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
        ].map(([x, y]) => [x + cursor[0], y  + cursor[1]])
      }
    ],
    getPolygon: (d) => d.polygon,
    getFillColor: hexToRgb(color),
    getLineColor: [0, 0, 0, 255],
    stroked: true,
    filled: true,
  })

  return (
    <div className='overflow-hidden w-full h-screen absolute inset-0 bg-gray-200'>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as ViewState)}
        controller={true}
        layers={[bitmap, polygon]}
        views={[
          new OrthographicView({
            flipY: false,
          })
        ]}
        getTooltip={({ coordinate }) => {
          if (coordinate && isInsideTexture(coordinate as [number, number])) {
            const text = `${coordinate[0].toFixed()}, ${coordinate[1].toFixed()}`
            return {
              text,
              style: {
                margin: '12px',
                borderRadius: '4px',
                color: 'white'
              }
            }
          }
          return null
        }}
        onClick={({ coordinate }) => {
          if (coordinate && isInsideTexture(coordinate as [number, number])) {
            const [x, y] = coordinate as [number, number]
            setViewState((viewState) => ({
              ...viewState,
              zoom: 4,
              target: [x, y],
              transitionDuration: 500,
            }))
          }
        }}
      />
      <div className='m-4 fixed bottom-0 left-0 flex gap-4 items-end'>
        <div className='bg-white w-28 p-3 shadow-lg rounded-lg'>
          {cursor && (
            <>
              <p className='text-gray-500 text-sm font-medium'>X: {cursor[0]}</p>
              <p className='text-gray-500 text-sm font-medium'>Y: {cursor[1]}</p>
            </>
          )}
          <p className='text-gray-500 text-sm font-medium'>Zoom: {zoomDisplay}x</p>
        </div>
        <ColorPicker color={color} setColor={setColor} />
        <button
          className='bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-2 px-4 rounded-md shadow-lg'
          onClick={() => {
            if (cursor) {
              modifyImageData(cursor[0], cursor[1], color)
            }
          }}
        >Place your pixel!</button>
      </div>
      {/* <div className='hidden'>
        <canvas ref={canvasRef} id='texture-canvas' width={TEXTURE_BOUNDS[2]} height={TEXTURE_BOUNDS[3]} />
      </div> */}
    </div>
  ) 
}

function isInsideTexture([x, y]: [number, number]) {
  return x >= TEXTURE_BOUNDS[0] && x <= TEXTURE_BOUNDS[2] && y >= TEXTURE_BOUNDS[1] && y <= TEXTURE_BOUNDS[3]
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace('#', ''), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b] as [number, number, number]
}

const COLORS = [
  '#ff4500',
  '#ffa800',
  '#ffd635',
  '#00a368',
  '#7eed56',
  '#2450a4',
  '#3690ea',
  '#51e9f4',
  '#811e9f',
  '#b44ac0',
  '#ff99aa',
  '#9c6926',
  '#000000',
  '#898d90',
  '#ffffff',
]
function ColorPicker({ color, setColor }: { color: string; setColor: (color: string) => void }) {
  return (
    <div className='p-3 border border-gray-300 bg-gray-100 rounded-md flex flex-wrap items-center gap-2'>
      {COLORS.map((c) => (
        <button
          key={c}
          aria-label="Color picker button"
          className={`${c === color ? 'w-10 h-10 shadow-lg' : 'w-8 h-8 shadow-md'} rounded-full border-2 border-white cursor-pointer`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  )
}