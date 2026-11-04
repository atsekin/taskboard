import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PriorityPicker } from './PriorityPicker'

describe('PriorityPicker', () => {
  it('renders all 4 priority options', () => {
    render(<PriorityPicker selected={null} onChange={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('marks the selected priority as pressed', () => {
    render(<PriorityPicker selected={{ id: '1', title: 'High' }} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Low' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects a priority with a generated id and the priority group when an unselected option is clicked', async () => {
    const onChange = vi.fn()
    render(<PriorityPicker selected={null} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Critical' }))
    expect(onChange).toHaveBeenCalledWith({
      id: expect.any(String),
      title: 'Critical',
      group: 'priority',
    })
  })

  it('switches to a different priority when another option is clicked', async () => {
    const onChange = vi.fn()
    render(<PriorityPicker selected={{ id: '1', title: 'Low' }} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Medium' }))
    expect(onChange).toHaveBeenCalledWith({
      id: expect.any(String),
      title: 'Medium',
      group: 'priority',
    })
  })

  it('clears the priority when the already-selected option is clicked', async () => {
    const onChange = vi.fn()
    render(<PriorityPicker selected={{ id: '1', title: 'High' }} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'High' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('is operable from the keyboard via Tab and Enter', async () => {
    const onChange = vi.fn()
    render(<PriorityPicker selected={null} onChange={onChange} />)
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Critical' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith({
      id: expect.any(String),
      title: 'Critical',
      group: 'priority',
    })
  })
})
