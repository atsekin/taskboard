import { beforeEach, describe, expect, it } from 'vitest'
import { useBoardStore } from './boardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ cards: [] })
})

describe('addCard', () => {
  it('adds a card to the correct column with generated id and createdAt', () => {
    useBoardStore.getState().addCard('todo', 'Write report', 'Due Friday')
    const [card] = useBoardStore.getState().cards
    expect(card.title).toBe('Write report')
    expect(card.description).toBe('Due Friday')
    expect(card.columnId).toBe('todo')
    expect(typeof card.id).toBe('string')
    expect(card.id.length).toBeGreaterThan(0)
    expect(typeof card.createdAt).toBe('number')
  })

  it('defaults description to empty string when omitted', () => {
    useBoardStore.getState().addCard('todo', 'Write report')
    expect(useBoardStore.getState().cards[0].description).toBe('')
  })

  it('trims whitespace from title and description', () => {
    useBoardStore.getState().addCard('todo', '  Write report  ', '  details  ')
    const [card] = useBoardStore.getState().cards
    expect(card.title).toBe('Write report')
    expect(card.description).toBe('details')
  })

  it('is a no-op when title is empty or whitespace-only', () => {
    useBoardStore.getState().addCard('todo', '')
    useBoardStore.getState().addCard('todo', '   ')
    expect(useBoardStore.getState().cards).toHaveLength(0)
  })

  it('truncates a title longer than 100 chars to exactly 100', () => {
    const longTitle = 'a'.repeat(150)
    useBoardStore.getState().addCard('todo', longTitle)
    expect(useBoardStore.getState().cards[0].title).toHaveLength(100)
  })

  it('keeps a title of exactly 100 chars intact', () => {
    const exactTitle = 'a'.repeat(100)
    useBoardStore.getState().addCard('todo', exactTitle)
    expect(useBoardStore.getState().cards[0].title).toBe(exactTitle)
  })

  it('preserves prior cards across multiple calls', () => {
    useBoardStore.getState().addCard('todo', 'First')
    useBoardStore.getState().addCard('in-progress', 'Second')
    const { cards } = useBoardStore.getState()
    expect(cards).toHaveLength(2)
    expect(cards[0].title).toBe('First')
    expect(cards[1].title).toBe('Second')
  })
})

describe('updateCard', () => {
  it("updates the matching card's title and description, leaving others untouched", () => {
    useBoardStore.getState().addCard('todo', 'First')
    useBoardStore.getState().addCard('todo', 'Second')
    const [first, second] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(first.id, 'Updated', 'New description')

    const cards = useBoardStore.getState().cards
    expect(cards.find((c) => c.id === first.id)).toMatchObject({
      title: 'Updated',
      description: 'New description',
    })
    expect(cards.find((c) => c.id === second.id)).toMatchObject({
      title: 'Second',
      description: '',
    })
  })

  it('is a no-op when id does not exist', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const before = useBoardStore.getState().cards
    useBoardStore.getState().updateCard('nonexistent-id', 'Updated', 'desc')
    expect(useBoardStore.getState().cards).toEqual(before)
  })

  it('is a no-op when the new title is empty or whitespace-only', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(card.id, '   ', 'desc')
    expect(useBoardStore.getState().cards[0].title).toBe('First')
    expect(useBoardStore.getState().cards[0].description).toBe('')
  })

  it('truncates an overlong new title to 100 chars', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const [card] = useBoardStore.getState().cards
    const longTitle = 'b'.repeat(150)
    useBoardStore.getState().updateCard(card.id, longTitle, '')
    expect(useBoardStore.getState().cards[0].title).toHaveLength(100)
  })
})

describe('deleteCard', () => {
  it('removes the matching card by id', () => {
    useBoardStore.getState().addCard('todo', 'First')
    useBoardStore.getState().addCard('todo', 'Second')
    const [first] = useBoardStore.getState().cards
    useBoardStore.getState().deleteCard(first.id)
    const cards = useBoardStore.getState().cards
    expect(cards).toHaveLength(1)
    expect(cards[0].title).toBe('Second')
  })

  it('is a no-op when id does not exist', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const before = useBoardStore.getState().cards
    useBoardStore.getState().deleteCard('nonexistent-id')
    expect(useBoardStore.getState().cards).toEqual(before)
  })
})

describe('moveCard', () => {
  it('moves right from todo to in-progress to done', () => {
    useBoardStore.getState().addCard('todo', 'Task')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().moveCard(card.id, 'right')
    expect(useBoardStore.getState().cards[0].columnId).toBe('in-progress')
    useBoardStore.getState().moveCard(card.id, 'right')
    expect(useBoardStore.getState().cards[0].columnId).toBe('done')
  })

  it('moves left from done to in-progress to todo', () => {
    useBoardStore.getState().addCard('done', 'Task')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().moveCard(card.id, 'left')
    expect(useBoardStore.getState().cards[0].columnId).toBe('in-progress')
    useBoardStore.getState().moveCard(card.id, 'left')
    expect(useBoardStore.getState().cards[0].columnId).toBe('todo')
  })

  it('is a no-op when moving left from the first column', () => {
    useBoardStore.getState().addCard('todo', 'Task')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().moveCard(card.id, 'left')
    expect(useBoardStore.getState().cards[0].columnId).toBe('todo')
  })

  it('is a no-op when moving right from the last column', () => {
    useBoardStore.getState().addCard('done', 'Task')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().moveCard(card.id, 'right')
    expect(useBoardStore.getState().cards[0].columnId).toBe('done')
  })

  it('is a no-op when id does not exist', () => {
    useBoardStore.getState().addCard('todo', 'Task')
    const before = useBoardStore.getState().cards
    useBoardStore.getState().moveCard('nonexistent-id', 'right')
    expect(useBoardStore.getState().cards).toEqual(before)
  })
})

describe('persistence', () => {
  it('writes cards to localStorage under the taskboard-storage key', () => {
    useBoardStore.getState().addCard('todo', 'Persisted task')
    const raw = localStorage.getItem('taskboard-storage')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(parsed.state.cards).toHaveLength(1)
    expect(parsed.state.cards[0].title).toBe('Persisted task')
  })
})
