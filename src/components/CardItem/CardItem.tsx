import { useState } from 'react'
import type { Card } from '../../store/boardStore'
import { COLUMN_IDS, useBoardStore } from '../../store/boardStore'
import CardForm from '../CardForm/CardForm'
import Modal from '../Modal/Modal'
import { TagList } from '../TagList/TagList'

interface CardItemProps {
  card: Card
}

function CardItem({ card }: CardItemProps) {
  const updateCard = useBoardStore((state) => state.updateCard)
  const deleteCard = useBoardStore((state) => state.deleteCard)
  const moveCard = useBoardStore((state) => state.moveCard)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const isFirst = card.columnId === COLUMN_IDS[0]
  const isLast = card.columnId === COLUMN_IDS[COLUMN_IDS.length - 1]

  return (
    <div className="rounded border border-slate-200 bg-white p-2 shadow-sm">
      <p className="font-medium text-slate-800">{card.title}</p>
      {card.description && (
        <p className="mt-1 text-sm text-slate-500">{card.description}</p>
      )}
      <TagList tags={card.tags} className="mt-2" />
      <div className="mt-2 flex items-center gap-1">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => moveCard(card.id, 'left')}
          aria-label="Move left"
          className="rounded px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          ←
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => moveCard(card.id, 'right')}
          aria-label="Move right"
          className="rounded px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="ml-auto rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteCard(card.id)}
          className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <CardForm
          submitLabel="Save"
          initialTitle={card.title}
          initialDescription={card.description}
          initialTags={card.tags}
          onSubmit={(title, description, tags) => {
            updateCard(card.id, title, description, tags)
            setIsEditOpen(false)
          }}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default CardItem
