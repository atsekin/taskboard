import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColumnId = 'todo' | 'in-progress' | 'done'

export const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'done']

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export const TAG_TITLES = [
  'Bug',
  'Feature',
  'Improvement',
  'Research',
  'Frontend',
  'Backend',
  'Design',
  'Documentation',
] as const

export type TagTitle = (typeof TAG_TITLES)[number]

export const DEFAULT_GROUP = 'default'
export const PRIORITY_GROUP = 'priority'

export type TagGroup = typeof DEFAULT_GROUP | typeof PRIORITY_GROUP

export const PRIORITY_TITLES = ['Critical', 'High', 'Medium', 'Low'] as const

export type PriorityTitle = (typeof PRIORITY_TITLES)[number]

export interface Tag {
  id: string
  title: TagTitle | PriorityTitle
  group?: TagGroup
}

export function dedupeTagsByGroup(tags: Tag[]): Tag[] {
  const result: Tag[] = []
  const groupIndex = new Map<string, number>()
  for (const tag of tags) {
    if (tag.group && tag.group !== DEFAULT_GROUP) {
      const existingIndex = groupIndex.get(tag.group)
      if (existingIndex !== undefined) {
        result[existingIndex] = tag
        continue
      }
      groupIndex.set(tag.group, result.length)
    }
    result.push(tag)
  }
  return result
}

export interface Card {
  id: string
  title: string
  description: string
  columnId: ColumnId
  createdAt: number
  tags: Tag[]
}

interface BoardState {
  cards: Card[]
  addCard: (columnId: ColumnId, title: string, description?: string, tags?: Tag[]) => void
  updateCard: (id: string, title: string, description: string, tags: Tag[]) => void
  deleteCard: (id: string) => void
  moveCard: (id: string, direction: 'left' | 'right') => void
}

const MAX_TITLE_LENGTH = 100
const STORE_VERSION = 1

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (columnId, title, description = '', tags = []) => {
        const trimmedTitle = title.trim().slice(0, MAX_TITLE_LENGTH)
        if (!trimmedTitle) return
        const newCard: Card = {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          description: description.trim(),
          columnId,
          createdAt: Date.now(),
          tags: dedupeTagsByGroup(tags),
        }
        set({ cards: [...get().cards, newCard] })
      },
      updateCard: (id, title, description, tags) => {
        const trimmedTitle = title.trim().slice(0, MAX_TITLE_LENGTH)
        if (!trimmedTitle) return
        set({
          cards: get().cards.map((card) =>
            card.id === id
              ? {
                ...card,
                title: trimmedTitle,
                description: description.trim(),
                tags: dedupeTagsByGroup(tags),
              }
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
      version: STORE_VERSION,
      partialize: (state) => ({ cards: state.cards }),
      migrate: (persistedState, version) => {
        const state = persistedState as { cards: Array<Card & { tags?: Tag[] }> }
        if (version < 1) {
          return {
            ...state,
            cards: state.cards.map((card) => ({ ...card, tags: card.tags ?? [] })),
          }
        }
        return state as { cards: Card[] }
      },
    },
  ),
)
