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
export default function ColorPicker({ color, setColor }: { color: string; setColor: (color: string) => void }) {
  return (
    <div className='p-3 shadow-md border border-gray-300 bg-gray-100 rounded-md flex flex-wrap items-center justify-center gap-2'>
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