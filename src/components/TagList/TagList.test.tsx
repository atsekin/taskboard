import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagList } from './TagList'

describe('TagList', () => {
  it('renders each tag title', () => {
    render(
      <TagList
        tags={[
          { id: '1', title: 'Bug' },
          { id: '2', title: 'Design' },
        ]}
      />,
    )
    expect(screen.getByText('Bug')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('renders nothing when there are no tags', () => {
    const { container } = render(<TagList tags={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a regular tag with the default tag style', () => {
    render(<TagList tags={[{ id: '1', title: 'Bug', group: 'default' }]} />)
    expect(screen.getByText('Bug')).toHaveClass('bg-tag-bg', 'text-tag-text')
  })

  it('renders Frontend and Design tags with the accent color', () => {
    render(
      <TagList
        tags={[
          { id: '1', title: 'Frontend', group: 'default' },
          { id: '2', title: 'Design', group: 'default' },
        ]}
      />,
    )
    expect(screen.getByText('Design')).toHaveClass('bg-tag-accent-bg')
    const item = screen.getByText('Frontend')
    expect(item).toHaveClass('bg-tag-accent-bg')
    expect(item).not.toHaveClass('bg-tag-bg')
  })

  it('renders a priority tag with a distinct color instead of the neutral style', () => {
    render(<TagList tags={[{ id: '1', title: 'Critical', group: 'priority' }]} />)
    const item = screen.getByText('Critical')
    expect(item).toHaveClass('bg-priority-critical-bg', 'text-priority-text-light')
    expect(item).not.toHaveClass('bg-tag-bg')
  })

  it('gives each priority level its own color', () => {
    render(
      <TagList
        tags={[
          { id: '1', title: 'High', group: 'priority' },
          { id: '2', title: 'Low', group: 'priority' },
        ]}
      />,
    )
    expect(screen.getByText('High')).toHaveClass('bg-priority-high-bg', 'text-priority-text-light')
    expect(screen.getByText('Low')).toHaveClass('bg-priority-low-bg', 'text-priority-text-dark')
  })
})
