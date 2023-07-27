import { useEffect, useState } from "react"

const TIME_TO_RESET = 30 * 1000

function useCountdown(lastInteractionTime: number) {
  const [time, setTime] = useState(TIME_TO_RESET - (Date.now() - lastInteractionTime))

  useEffect(() => {
    if (TIME_TO_RESET - (Date.now() - lastInteractionTime) <= 0) {
      setTime(0)
      return
    }

    const interval = setInterval(() => {
      setTime(TIME_TO_RESET - (Date.now() - lastInteractionTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [lastInteractionTime])

  return time
}

const lastInteractionMock = Date.now() - 1000 * 60

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
}

export default function ActionButton({ x, y, z, onClick }: { x: number; y: number; z: number; onClick: () => void }) {
  const zoomDisplay = Math.round(2 ** (z * 10)) / 10
  const ms = useCountdown(lastInteractionMock)
  const displayTime = formatTime(ms)
  const showCounter = ms > 0
  const gradientWidth = (ms / TIME_TO_RESET) * 100

  return (
    <div className='bg-white p-4 shadow-md rounded-lg'>
      <div className='flex justify-center gap-2 mb-2'>
        <p className='text-gray-500 text-sm font-medium'>
          X<strong className='text-lg font-semibold'>{x}</strong>
        </p>
        <p className='text-gray-500 text-sm font-medium'>
          Y<strong className='text-lg font-semibold'>{y}</strong>
        </p>
        <p className='text-gray-500 text-sm font-medium'>
          Z<strong className='text-lg font-semibold'>{zoomDisplay}</strong>
        </p>
      </div>
      {showCounter ? (
        <div
          className='text-white relative w-full text-center text-lg font-bold py-2 px-4 rounded-md'
          style={{ background: `linear-gradient(to right, #666, #666 ${gradientWidth}%, #999 ${gradientWidth}%)` }}
        >
          Wait {displayTime}
        </div>
      ) : (
        <button
          className='bg-orange-500 hover:bg-orange-600 shadow-orange-500/50 text-white text-lg font-bold py-2 px-4 rounded-md shadow-md'
          onClick={onClick}
        >Place your pixel!</button>
      )}
    </div>
  ) 
}
