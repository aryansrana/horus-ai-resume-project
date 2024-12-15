import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { removeTokenCookie } from '../utils/auth'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  removeTokenCookie: jest.fn(),
}))
jest.mock('../components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}))

describe('Navbar', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  const mockEmail = 'test@example.com'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders correctly', () => {
    render(<Navbar email={mockEmail} />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByText(mockEmail)).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('handles sign out', async () => {
    render(<Navbar email={mockEmail} />)
    fireEvent.click(screen.getByText('Sign Out'))
    expect(removeTokenCookie).toHaveBeenCalled()
    })
})

