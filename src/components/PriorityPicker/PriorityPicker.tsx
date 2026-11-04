import { PRIORITY_GROUP, PRIORITY_TITLES, type Tag } from '../../store/boardStore'

export type PriorityPickerProps = {
  selected: Tag | null
  onChange: (tag: Tag | null) => void
  className?: string
}

export function PriorityPicker({ selected, onChange, className = '' }: PriorityPickerProps) {
  const handleToggle = (title: (typeof PRIORITY_TITLES)[number]) => {
    if (selected?.title === title) {
      onChange(null)
    } else {
      onChange({ id: crypto.randomUUID(), title, group: PRIORITY_GROUP })
    }
  }

  return (
    <div
      className={`flex flex-wrap gap-1 ${className}`.trim()}
      role="group"
      aria-label="Priority"
    >
      {PRIORITY_TITLES.map((title) => {
        const active = selected?.title === title
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
