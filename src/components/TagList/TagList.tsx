import type { Tag } from '../../store/boardStore'

export type TagListProps = {
  tags: Tag[]
  className?: string
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (tags.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-1 ${className}`.trim()} aria-label="Tags">
      {tags.map((tag) => (
        <li
          key={tag.id}
          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
        >
          {tag.title}
        </li>
      ))}
    </ul>
  )
}
