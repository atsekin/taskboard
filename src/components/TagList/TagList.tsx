import { PRIORITY_GROUP, type PriorityTitle, type Tag } from '../../store/boardStore'

export type TagListProps = {
  tags: Tag[]
  className?: string
}

const PRIORITY_COLORS: Record<PriorityTitle, string> = {
  Critical: 'bg-priority-critical-bg text-priority-text-light',
  High: 'bg-priority-high-bg text-priority-text-light',
  Medium: 'bg-priority-medium-bg text-priority-text-dark',
  Low: 'bg-priority-low-bg text-priority-text-dark',
}

// Figma's pink "Mobile" tag colour, applied to the closest app tags.
const ACCENT_TAG_TITLES: ReadonlySet<Tag['title']> = new Set(['Frontend', 'Design'])

function tagClassName(tag: Tag): string {
  if (tag.group === PRIORITY_GROUP) {
    return `rounded-priority px-2 py-1 ${PRIORITY_COLORS[tag.title as PriorityTitle]}`
  }
  const background = ACCENT_TAG_TITLES.has(tag.title) ? 'bg-tag-accent-bg' : 'bg-tag-bg'
  return `rounded-tag p-1 text-tag-text ${background}`
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (tags.length === 0) return null

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`.trim()} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag.id} className={`text-tag font-normal ${tagClassName(tag)}`}>
          {tag.title}
        </li>
      ))}
    </ul>
  )
}
