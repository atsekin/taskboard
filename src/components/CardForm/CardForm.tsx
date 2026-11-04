import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Tag } from '../../store/boardStore'
import { TagPicker } from '../TagPicker'

export type CardFormProps = {
  initialTitle?: string
  initialDescription?: string
  initialTags?: Tag[]
  submitLabel: string
  onSubmit: (title: string, description: string, tags: Tag[]) => void
  onCancel: () => void
  className?: string
}

const MAX_TITLE_LENGTH = 100

export function CardForm({
  initialTitle = '',
  initialDescription = '',
  initialTags = [],
  submitLabel,
  onSubmit,
  onCancel,
  className = '',
}: CardFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [tags, setTags] = useState<Tag[]>(initialTags)

  const trimmedTitle = title.trim()
  const isValid = trimmedTitle.length > 0 && trimmedTitle.length <= MAX_TITLE_LENGTH

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isValid) onSubmit(title, description, tags)
  }

  return (
    <form className={`flex flex-col gap-2 ${className}`.trim()} onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={handleTitleChange}
        maxLength={MAX_TITLE_LENGTH}
        placeholder="Title"
        autoFocus
        className="rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <p className="text-right text-xs text-slate-400">
        {title.length}/{MAX_TITLE_LENGTH}
      </p>
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Description (optional)"
        rows={3}
        className="rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <TagPicker selected={tags} onChange={setTags} />
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
