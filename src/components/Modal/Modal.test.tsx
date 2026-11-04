import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders children in a dialog when open', () => {
    render(
      <Modal open onClose={vi.fn()}>
        Example content
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Example content')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        Example content
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Example content
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Example content
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    await userEvent.click(dialog.parentElement as HTMLElement)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when clicking inside the dialog', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Example content
      </Modal>,
    )
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('applies an external className to the dialog box', () => {
    render(
      <Modal open onClose={vi.fn()} className="mt-4">
        Example content
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('mt-4')
  })
})
