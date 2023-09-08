export default function ActionButton({ x, y, z, onClick }: { x: number; y: number; z: number; onClick: () => void }) {
  const zoomDisplay = Math.round(2 ** z)
  return (
    <div className='bg-white shadow-md rounded-lg max-w-lg relative'>
      <div className='px-3 py-2 flex justify-evenly gap-2 max-w-sm mx-auto'>
        <p className='text-gray-500 text-sm font-medium'>
          X <strong className='text-lg font-semibold'>{x}</strong>
        </p>
        <p className='text-gray-500 text-sm font-medium'>
          Y <strong className='text-lg font-semibold'>{y}</strong>
        </p>
        <p className='text-gray-500 text-sm font-medium'>
          Z <strong className='text-lg font-semibold'>{zoomDisplay}</strong>
        </p>
      </div>
      <button
        className='-mx-2 bg-orange-500 hover:bg-orange-600 shadow-orange-500/50 text-white text-lg font-bold py-2 px-4 rounded-md shadow-md'
        onClick={onClick}
      >Place your pixel!</button>
    </div>
  ) 
}
