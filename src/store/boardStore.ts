import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColumnId = 'todo' | 'in-progress' | 'done'

export const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'done']

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export interface Card {
  id: string
  title: string
  description: string
  columnId: ColumnId
  createdAt: number
}

interface BoardState {
  cards: Card[]
  addCard: (columnId: ColumnId, title: string, description?: string) => void
  updateCard: (id: string, title: string, description: string) => void
  deleteCard: (id: string) => void
  moveCard: (id: string, direction: 'left' | 'right') => void
}

const MAX_TITLE_LENGTH = 100

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (columnId, title, description = '') => {
        const trimmedTitle = title.trim().slice(0, MAX_TITLE_LENGTH)
        if (!trimmedTitle) return
        const newCard: Card = {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          description: description.trim(),
          columnId,
          createdAt: Date.now(),
        }
        set({ cards: [...get().cards, newCard] })
      },
      updateCard: (id, title, description) => {
        const trimmedTitle = title.trim().slice(0, MAX_TITLE_LENGTH)
        if (!trimmedTitle) return
        set({
          cards: get().cards.map((card) =>
            card.id === id
              ? { ...card, title: trimmedTitle, description: description.trim() }
              : card,
          ),
        })
      },
      deleteCard: (id) => {
        set({ cards: get().cards.filter((card) => card.id !== id) })
      },
      moveCard: (id, direction) => {
        set({
          cards: get().cards.map((card) => {
            if (card.id !== id) return card
            const idx = COLUMN_IDS.indexOf(card.columnId)
            const nextIdx = direction === 'left' ? idx - 1 : idx + 1
            if (nextIdx < 0 || nextIdx >= COLUMN_IDS.length) return card
            return { ...card, columnId: COLUMN_IDS[nextIdx] }
          }),
        })
      },
    }),
    {
      name: 'taskboard-storage',
      partialize: (state) => ({ cards: state.cards }),
    },
  ),
)
