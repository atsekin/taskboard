import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardForm } from './CardForm'

describe('CardForm', () => {
  it('renders empty fields by default', () => {
    render(<CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByPlaceholderText('Title')).toHaveValue('')
    expect(screen.getByPlaceholderText('Description (optional)')).toHaveValue('')
    expect(screen.getByText('0/100')).toBeInTheDocument()
  })

  it('pre-fills fields from initial props', () => {
    render(
      <CardForm
        submitLabel="Save"
        initialTitle="Write report"
        initialDescription="Due Friday"
        initialTags={[{ id: '1', title: 'Bug' }]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Write report')
    expect(screen.getByPlaceholderText('Description (optional)')).toHaveValue('Due Friday')
    expect(screen.getByRole('button', { name: 'Bug' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates the character counter as the title is typed', async () => {
    render(<CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Hi')
    expect(screen.getByText('2/100')).toBeInTheDocument()
  })

  it('disables submit when the title is empty or whitespace-only', async () => {
    render(<CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    const submit = screen.getByRole('button', { name: 'Add' })
    expect(submit).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText('Title'), '   ')
    expect(submit).toBeDisabled()
  })

  it('enables submit once a valid title is entered', async () => {
    render(<CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Write report')
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
  })

  it('calls onSubmit with the entered values when submitted', async () => {
    const onSubmit = vi.fn()
    render(<CardForm submitLabel="Add" onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Write report')
    await userEvent.type(screen.getByPlaceholderText('Description (optional)'), 'Due Friday')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onSubmit).toHaveBeenCalledWith('Write report', 'Due Friday', [])
  })

  it('includes tags selected via TagPicker in onSubmit', async () => {
    const onSubmit = vi.fn()
    render(<CardForm submitLabel="Add" onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Write report')
    await userEvent.click(screen.getByRole('button', { name: 'Bug' }))
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onSubmit).toHaveBeenCalledWith('Write report', '', [
      { id: expect.any(String), title: 'Bug', group: 'default' },
    ])
  })

  it('includes the selected priority alongside regular tags in onSubmit', async () => {
    const onSubmit = vi.fn()
    render(<CardForm submitLabel="Add" onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Write report')
    await userEvent.click(screen.getByRole('button', { name: 'Bug' }))
    await userEvent.click(screen.getByRole('button', { name: 'Critical' }))
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onSubmit).toHaveBeenCalledWith('Write report', '', [
      { id: expect.any(String), title: 'Bug', group: 'default' },
      { id: expect.any(String), title: 'Critical', group: 'priority' },
    ])
  })

  it('separates a pre-filled priority tag from the regular TagPicker selection', () => {
    render(
      <CardForm
        submitLabel="Save"
        initialTags={[
          { id: '1', title: 'Bug', group: 'default' },
          { id: '2', title: 'High', group: 'priority' },
        ]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Bug' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('omits priority from onSubmit after it is cleared', async () => {
    const onSubmit = vi.fn()
    render(
      <CardForm
        submitLabel="Save"
        initialTitle="Write report"
        initialTags={[{ id: '2', title: 'High', group: 'priority' }]}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'High' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSubmit).toHaveBeenCalledWith('Write report', '', [])
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('applies an external className to the form', () => {
    const { container } = render(
      <CardForm submitLabel="Add" onSubmit={vi.fn()} onCancel={vi.fn()} className="mt-4" />,
    )
    expect(container.querySelector('form')).toHaveClass('mt-4')
  })
})
