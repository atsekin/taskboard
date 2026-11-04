import { beforeEach, describe, expect, it } from 'vitest'
import { dedupeTagsByGroup, useBoardStore } from './boardStore'

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

  it('defaults tags to an empty array when omitted', () => {
    useBoardStore.getState().addCard('todo', 'Write report')
    expect(useBoardStore.getState().cards[0].tags).toEqual([])
  })

  it('stores provided tags on the new card', () => {
    const tags = [{ id: 't1', title: 'Bug' as const }]
    useBoardStore.getState().addCard('todo', 'Write report', '', tags)
    expect(useBoardStore.getState().cards[0].tags).toEqual(tags)
  })

  it('keeps only the latest tag for a non-default group', () => {
    const tags = [
      { id: 'p1', title: 'Low' as const, group: 'priority' as const },
      { id: 'p2', title: 'Critical' as const, group: 'priority' as const },
    ]
    useBoardStore.getState().addCard('todo', 'Write report', '', tags)
    expect(useBoardStore.getState().cards[0].tags).toEqual([
      { id: 'p2', title: 'Critical', group: 'priority' },
    ])
  })

  it('allows multiple default-group tags to coexist', () => {
    const tags = [
      { id: 't1', title: 'Bug' as const, group: 'default' as const },
      { id: 't2', title: 'Feature' as const, group: 'default' as const },
    ]
    useBoardStore.getState().addCard('todo', 'Write report', '', tags)
    expect(useBoardStore.getState().cards[0].tags).toEqual(tags)
  })
})

describe('updateCard', () => {
  it("updates the matching card's title and description, leaving others untouched", () => {
    useBoardStore.getState().addCard('todo', 'First')
    useBoardStore.getState().addCard('todo', 'Second')
    const [first, second] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(first.id, 'Updated', 'New description', [])

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
    useBoardStore.getState().updateCard('nonexistent-id', 'Updated', 'desc', [])
    expect(useBoardStore.getState().cards).toEqual(before)
  })

  it('is a no-op when the new title is empty or whitespace-only', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(card.id, '   ', 'desc', [])
    expect(useBoardStore.getState().cards[0].title).toBe('First')
    expect(useBoardStore.getState().cards[0].description).toBe('')
  })

  it('truncates an overlong new title to 100 chars', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const [card] = useBoardStore.getState().cards
    const longTitle = 'b'.repeat(150)
    useBoardStore.getState().updateCard(card.id, longTitle, '', [])
    expect(useBoardStore.getState().cards[0].title).toHaveLength(100)
  })

  it("replaces the matching card's tags", () => {
    useBoardStore.getState().addCard('todo', 'First', '', [{ id: 't1', title: 'Bug' as const }])
    const [card] = useBoardStore.getState().cards
    const newTags = [{ id: 't2', title: 'Feature' as const }]
    useBoardStore.getState().updateCard(card.id, card.title, card.description, newTags)
    expect(useBoardStore.getState().cards[0].tags).toEqual(newTags)
  })

  it('clears tags when given an empty array', () => {
    useBoardStore.getState().addCard('todo', 'First', '', [{ id: 't1', title: 'Bug' as const }])
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(card.id, card.title, card.description, [])
    expect(useBoardStore.getState().cards[0].tags).toEqual([])
  })

  it('leaves tags untouched when the no-op-empty-title guard fires', () => {
    useBoardStore.getState().addCard('todo', 'First', '', [{ id: 't1', title: 'Bug' as const }])
    const [card] = useBoardStore.getState().cards
    useBoardStore.getState().updateCard(card.id, '   ', 'desc', [])
    expect(useBoardStore.getState().cards[0].tags).toEqual([{ id: 't1', title: 'Bug' }])
  })

  it('keeps only the latest tag for a non-default group on update', () => {
    useBoardStore.getState().addCard('todo', 'First')
    const [card] = useBoardStore.getState().cards
    const tags = [
      { id: 'p1', title: 'Medium' as const, group: 'priority' as const },
      { id: 'p2', title: 'High' as const, group: 'priority' as const },
    ]
    useBoardStore.getState().updateCard(card.id, card.title, card.description, tags)
    expect(useBoardStore.getState().cards[0].tags).toEqual([
      { id: 'p2', title: 'High', group: 'priority' },
    ])
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

describe('dedupeTagsByGroup', () => {
  it('replaces an earlier tag in the same non-default group in place, preserving position', () => {
    const tags = [
      { id: 't1', title: 'Bug' as const, group: 'default' as const },
      { id: 'p1', title: 'Low' as const, group: 'priority' as const },
      { id: 't2', title: 'Feature' as const, group: 'default' as const },
      { id: 'p2', title: 'Critical' as const, group: 'priority' as const },
    ]
    expect(dedupeTagsByGroup(tags)).toEqual([
      { id: 't1', title: 'Bug', group: 'default' },
      { id: 'p2', title: 'Critical', group: 'priority' },
      { id: 't2', title: 'Feature', group: 'default' },
    ])
  })

  it('leaves tags with no group or the default group untouched', () => {
    const tags = [
      { id: 't1', title: 'Bug' as const },
      { id: 't2', title: 'Feature' as const, group: 'default' as const },
    ]
    expect(dedupeTagsByGroup(tags)).toEqual(tags)
  })
})

describe('tags persistence migration', () => {
  it('backfills tags: [] on cards from a pre-tags localStorage record', async () => {
    const legacyState = {
      state: {
        cards: [
          { id: 'old-1', title: 'Legacy card', description: '', columnId: 'todo', createdAt: 1 },
        ],
      },
      version: 0,
    }
    localStorage.setItem('taskboard-storage', JSON.stringify(legacyState))
    await useBoardStore.persist.rehydrate()
    expect(useBoardStore.getState().cards[0].tags).toEqual([])
  })
})
