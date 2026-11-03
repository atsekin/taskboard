import { TAG_TITLES, type Tag } from '../../store/boardStore'

export type TagPickerProps = {
  selected: Tag[]
  onChange: (tags: Tag[]) => void
  className?: string
}

export function TagPicker({ selected, onChange, className = '' }: TagPickerProps) {
  const handleToggle = (title: (typeof TAG_TITLES)[number]) => {
    const existing = selected.find((tag) => tag.title === title)
    if (existing) {
      onChange(selected.filter((tag) => tag.id !== existing.id))
    } else {
      onChange([...selected, { id: crypto.randomUUID(), title }])
    }
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`.trim()} role="group" aria-label="Tags">
      {TAG_TITLES.map((title) => {
        const active = selected.some((tag) => tag.title === title)
        return (
          <button
            key={title}
            type="button"
            aria-pressed={active}
            onClick={() => handleToggle(title)}
            className={`rounded-full border px-2 py-0.5 text-xs font-medium focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active
                ? 'border-slate-700 bg-slate-700 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {title}
          </button>
        )
      })}
    </div>
  )
}
