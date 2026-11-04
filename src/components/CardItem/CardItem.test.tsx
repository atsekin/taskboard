import { beforeEach, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useBoardStore } from '../../store/boardStore'
import type { Card } from '../../store/boardStore'
import { CardItem } from './CardItem'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ cards: [] })
})

function addAndGetCard(
  columnId: Card['columnId'],
  title: string,
  description = '',
  tags: Card['tags'] = [],
) {
  useBoardStore.getState().addCard(columnId, title, description, tags)
  const cards = useBoardStore.getState().cards
  return cards[cards.length - 1]
}

describe('CardItem', () => {
  it('renders the card title and description', () => {
    const card = addAndGetCard('todo', 'Write report', 'Due Friday')
    render(<CardItem card={card} />)
    expect(screen.getByText('Write report')).toBeInTheDocument()
    expect(screen.getByText('Due Friday')).toBeInTheDocument()
  })

  it('does not render a description paragraph when description is empty', () => {
    const card = addAndGetCard('todo', 'Write report', '')
    render(<CardItem card={card} />)
    expect(screen.queryByText('Due Friday')).not.toBeInTheDocument()
  })

  it('renders tags via TagList', () => {
    const card = addAndGetCard('todo', 'Write report', '', [{ id: '1', title: 'Bug' }])
    render(<CardItem card={card} />)
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders no tag list when the card has no tags', () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    expect(screen.queryByRole('list', { name: 'Tags' })).not.toBeInTheDocument()
  })

  it('disables move left in the first column and move right in the last column', () => {
    const first = addAndGetCard('todo', 'First')
    const { rerender } = render(<CardItem card={first} />)
    expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Move right' })).toBeEnabled()

    const last = addAndGetCard('done', 'Last')
    rerender(<CardItem card={last} />)
    expect(screen.getByRole('button', { name: 'Move left' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled()
  })

  it('moves the card to the right column in the store when Move right is clicked', async () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Move right' }))
    expect(useBoardStore.getState().cards[0].columnId).toBe('in-progress')
  })

  it('deletes the card from the store when Delete is clicked', async () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(useBoardStore.getState().cards).toHaveLength(0)
  })

  it('opens an edit dialog pre-filled with the card details when Edit is clicked', async () => {
    const card = addAndGetCard('todo', 'Write report', 'Due Friday')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Write report')
    expect(screen.getByPlaceholderText('Description (optional)')).toHaveValue('Due Friday')
  })

  it('saves edits to the store and closes the dialog', async () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const titleInput = screen.getByPlaceholderText('Title')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated title')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(useBoardStore.getState().cards[0].title).toBe('Updated title')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cancels the edit dialog without updating the store', async () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const titleInput = screen.getByPlaceholderText('Title')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Should not save')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(useBoardStore.getState().cards[0].title).toBe('Write report')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the edit dialog when Escape is pressed', async () => {
    const card = addAndGetCard('todo', 'Write report')
    render(<CardItem card={card} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
