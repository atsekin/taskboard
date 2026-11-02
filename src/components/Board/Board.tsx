import { COLUMN_IDS, COLUMN_TITLES } from '../../store/boardStore'
import Column from '../Column/Column'

function Board() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex gap-4">
        {COLUMN_IDS.map((columnId) => (
          <Column key={columnId} columnId={columnId} title={COLUMN_TITLES[columnId]} />
        ))}
      </div>
    </div>
  )
}

export default Board
