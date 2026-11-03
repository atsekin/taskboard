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
})
