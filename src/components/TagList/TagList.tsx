import { PRIORITY_GROUP, type PriorityTitle, type Tag } from '../../store/boardStore'

export type TagListProps = {
  tags: Tag[]
  className?: string
}

const PRIORITY_COLORS: Record<PriorityTitle, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-blue-100 text-blue-700',
}

function tagClassName(tag: Tag): string {
  if (tag.group === PRIORITY_GROUP) {
    return PRIORITY_COLORS[tag.title as PriorityTitle]
  }
  return 'bg-slate-100 text-slate-600'
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (tags.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-1 ${className}`.trim()} aria-label="Tags">
      {tags.map((tag) => (
        <li
          key={tag.id}
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagClassName(tag)}`}
        >
          {tag.title}
        </li>
      ))}
    </ul>
  )
}
