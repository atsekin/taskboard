import { beforeEach, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useBoardStore } from '../../store/boardStore'
import { Board } from './Board'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ cards: [] })
})

describe('Board', () => {
  it('renders one column per board column, with the correct titles', () => {
    render(<Board />)
    expect(screen.getByRole('heading', { name: 'To do' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In progress' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Done' })).toBeInTheDocument()
  })

  it('renders a card added to the store under its matching column', () => {
    useBoardStore.getState().addCard('in-progress', 'Write report')
    render(<Board />)
    expect(screen.getByText('Write report')).toBeInTheDocument()
  })

  it('applies an external className to the root element', () => {
    const { container } = render(<Board className="mt-4" />)
    expect(container.firstChild).toHaveClass('mt-4')
  })
})
