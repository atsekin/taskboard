import { useState } from 'react'
import type { Card, Tag } from '../../store/boardStore'
import { COLUMN_IDS, useBoardStore } from '../../store/boardStore'
import { CardForm } from '../CardForm'
import { Modal } from '../Modal'
import { TagList } from '../TagList'

export type CardItemProps = {
  card: Card
  className?: string
}

export function CardItem({ card, className = '' }: CardItemProps) {
  const updateCard = useBoardStore((state) => state.updateCard)
  const deleteCard = useBoardStore((state) => state.deleteCard)
  const moveCard = useBoardStore((state) => state.moveCard)
  const [editOpen, setEditOpen] = useState(false)

  const isFirst = card.columnId === COLUMN_IDS[0]
  const isLast = card.columnId === COLUMN_IDS[COLUMN_IDS.length - 1]

  const handleMoveLeft = () => moveCard(card.id, 'left')
  const handleMoveRight = () => moveCard(card.id, 'right')
  const handleOpenEdit = () => setEditOpen(true)
  const handleCloseEdit = () => setEditOpen(false)
  const handleDelete = () => deleteCard(card.id)
  const handleEditSubmit = (title: string, description: string, tags: Tag[]) => {
    updateCard(card.id, title, description, tags)
    setEditOpen(false)
  }

  return (
    <div className={`rounded border border-slate-200 bg-white p-2 shadow-sm ${className}`.trim()}>
      <p className="font-medium text-slate-800">{card.title}</p>
      {card.description && (
        <p className="mt-1 text-sm text-slate-500">{card.description}</p>
      )}
      <TagList tags={card.tags} className="mt-2" />
      <div className="mt-2 flex items-center gap-1">
        <button
          type="button"
          disabled={isFirst}
          onClick={handleMoveLeft}
          aria-label="Move left"
          className="rounded px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          ←
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={handleMoveRight}
          aria-label="Move right"
          className="rounded px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          →
        </button>
        <button
          type="button"
          onClick={handleOpenEdit}
          className="ml-auto rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      <Modal open={editOpen} onClose={handleCloseEdit}>
        <CardForm
          submitLabel="Save"
          initialTitle={card.title}
          initialDescription={card.description}
          initialTags={card.tags}
          onSubmit={handleEditSubmit}
          onCancel={handleCloseEdit}
        />
      </Modal>
    </div>
  )
}
