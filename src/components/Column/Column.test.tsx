import { beforeEach, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useBoardStore } from '../../store/boardStore'
import { Column } from './Column'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ cards: [] })
})

describe('Column', () => {
  it('renders the given title and the Add card button', () => {
    render(<Column columnId="todo" title="To do" />)
    expect(screen.getByRole('heading', { name: 'To do' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Add card' })).toBeInTheDocument()
  })

  it('renders only cards belonging to its column', () => {
    useBoardStore.getState().addCard('todo', 'Todo card')
    useBoardStore.getState().addCard('done', 'Done card')
    render(<Column columnId="todo" title="To do" />)
    expect(screen.getByText('Todo card')).toBeInTheDocument()
    expect(screen.queryByText('Done card')).not.toBeInTheDocument()
  })

  it('renders no cards when none match its column', () => {
    useBoardStore.getState().addCard('done', 'Done card')
    render(<Column columnId="todo" title="To do" />)
    expect(screen.queryByText('Done card')).not.toBeInTheDocument()
  })

  it('opens an empty Add dialog when + Add card is clicked', async () => {
    render(<Column columnId="todo" title="To do" />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add card' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('adds a card to the store and closes the dialog on valid submit', async () => {
    render(<Column columnId="todo" title="To do" />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add card' }))
    await userEvent.type(screen.getByPlaceholderText('Title'), 'New card')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(useBoardStore.getState().cards).toHaveLength(1)
    expect(useBoardStore.getState().cards[0].title).toBe('New card')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('New card')).toBeInTheDocument()
  })

  it('cancels the Add dialog without adding a card', async () => {
    render(<Column columnId="todo" title="To do" />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add card' }))
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Should not be added')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(useBoardStore.getState().cards).toHaveLength(0)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the Add dialog when Escape is pressed', async () => {
    render(<Column columnId="todo" title="To do" />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add card' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
