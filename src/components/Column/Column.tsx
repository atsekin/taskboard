import { useState } from 'react'
import type { ColumnId, Tag } from '../../store/boardStore'
import { useBoardStore } from '../../store/boardStore'
import { CardForm } from '../CardForm'
import { CardItem } from '../CardItem'
import { Modal } from '../Modal'

export type ColumnProps = {
  columnId: ColumnId
  title: string
  className?: string
}

export function Column({ columnId, title, className = '' }: ColumnProps) {
  const allCards = useBoardStore((state) => state.cards)
  const addCard = useBoardStore((state) => state.addCard)
  const cards = allCards.filter((card) => card.columnId === columnId)
  const [addOpen, setAddOpen] = useState(false)

  const handleOpenAdd = () => setAddOpen(true)
  const handleCloseAdd = () => setAddOpen(false)
  const handleAddSubmit = (cardTitle: string, description: string, tags: Tag[]) => {
    addCard(columnId, cardTitle, description, tags)
    setAddOpen(false)
  }

  return (
    <div
      className={`flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg bg-slate-50 p-3 ${className}`.trim()}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="rounded border border-dashed border-slate-300 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
        >
          + Add card
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      <Modal open={addOpen} onClose={handleCloseAdd}>
        <CardForm submitLabel="Add" onSubmit={handleAddSubmit} onCancel={handleCloseAdd} />
      </Modal>
    </div>
  )
}
