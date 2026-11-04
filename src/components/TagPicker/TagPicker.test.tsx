import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagPicker } from './TagPicker'

describe('TagPicker', () => {
  it('renders all 8 allowed tag options', () => {
    render(<TagPicker selected={[]} onChange={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(8)
  })

  it('marks selected tags as pressed', () => {
    render(<TagPicker selected={[{ id: '1', title: 'Bug' }]} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Bug' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Feature' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('adds a tag with a generated id when an unselected option is clicked', async () => {
    const onChange = vi.fn()
    render(<TagPicker selected={[]} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Bug' }))
    expect(onChange).toHaveBeenCalledWith([
      { id: expect.any(String), title: 'Bug', group: 'default' },
    ])
  })

  it('removes a tag when an already-selected option is clicked', async () => {
    const onChange = vi.fn()
    render(<TagPicker selected={[{ id: '1', title: 'Bug' }]} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Bug' }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('is operable from the keyboard via Tab and Enter', async () => {
    const onChange = vi.fn()
    render(<TagPicker selected={[]} onChange={onChange} />)
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Bug' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith([
      { id: expect.any(String), title: 'Bug', group: 'default' },
    ])
  })
})
