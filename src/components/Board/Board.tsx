import { COLUMN_IDS, COLUMN_TITLES } from '../../store/boardStore'
import { Column } from '../Column'

export type BoardProps = {
  className?: string
}

export function Board({ className = '' }: BoardProps) {
  return (
    <div className={`min-h-screen bg-slate-100 p-6 ${className}`.trim()}>
      <div className="flex gap-4">
        {COLUMN_IDS.map((columnId) => (
          <Column key={columnId} columnId={columnId} title={COLUMN_TITLES[columnId]} />
        ))}
      </div>
    </div>
  )
}
