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

  it('renders a regular tag with the neutral slate style', () => {
    render(<TagList tags={[{ id: '1', title: 'Bug', group: 'default' }]} />)
    expect(screen.getByText('Bug')).toHaveClass('bg-slate-100', 'text-slate-600')
  })

  it('renders a priority tag with a distinct color instead of the neutral style', () => {
    render(<TagList tags={[{ id: '1', title: 'Critical', group: 'priority' }]} />)
    const item = screen.getByText('Critical')
    expect(item).toHaveClass('bg-red-100', 'text-red-700')
    expect(item).not.toHaveClass('bg-slate-100')
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
    expect(screen.getByText('High')).toHaveClass('bg-orange-100', 'text-orange-700')
    expect(screen.getByText('Low')).toHaveClass('bg-blue-100', 'text-blue-700')
  })
})
