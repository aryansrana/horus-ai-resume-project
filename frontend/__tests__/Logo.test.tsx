import React from 'react'
import { render, screen } from '@testing-library/react'
import { Logo } from '../components/Logo'

describe('Logo', () => {
  it('renders correctly', () => {
    render(<Logo />)
    expect(screen.getByAltText('Horus AI Logo')).toBeInTheDocument()
    expect(screen.getByText('Horus AI')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

