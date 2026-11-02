import { useState } from 'react'
import type { ColumnId } from '../../store/boardStore'
import { useBoardStore } from '../../store/boardStore'
import CardForm from '../CardForm/CardForm'
import CardItem from '../CardItem/CardItem'
import Modal from '../Modal/Modal'

interface ColumnProps {
  columnId: ColumnId
  title: string
}

function Column({ columnId, title }: ColumnProps) {
  const allCards = useBoardStore((state) => state.cards)
  const addCard = useBoardStore((state) => state.addCard)
  const cards = allCards.filter((card) => card.columnId === columnId)
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
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

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <CardForm
          submitLabel="Add"
          onSubmit={(cardTitle, description) => {
            addCard(columnId, cardTitle, description)
            setIsAddOpen(false)
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Column
