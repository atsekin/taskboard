import { useEffect, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className = '' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleDialogClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-sm rounded-lg bg-white p-4 shadow-lg ${className}`.trim()}
        onClick={handleDialogClick}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
