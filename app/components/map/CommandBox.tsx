import CloseIcon from '@heroicons/react/20/solid/XMarkIcon'

export default function CommandBox({ x, y, color, onClose }: {
  x: number;
  y: number;
  color: string;
  onClose: () => void;
}) {
  return (
    <div className='bg-white p-4 shadow-md rounded-lg max-w-lg relative'>
      <button onClick={onClose} className="absolute top-0 right-0 p-1.5 hover:bg-gray-300/25 rounded-tr-lg rounded-bl-lg">
        <CloseIcon className='w-5 h-5 text-gray-600' />
      </button>
      <p className='mt-3'>
        To place a pixel in the canvas in your selected spot, pick a color and send a message to
        {' '}<a className="text-orange-500 hover:underline" href="https://mastodon.bot/@fedicanvas">@fedicanvas@mastodon.bot</a> with the following:
      </p>
      <p className="text-center mt-3">
        <code className='text-sm bg-gray-100 p-2 rounded-md'>!pixel {x} {y} {color}</code>
      </p>
    </div>
  ) 
}
