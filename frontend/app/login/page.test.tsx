import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './page'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock js-cookie
jest.mock('js-cookie')

// Mock jwt-decode
jest.mock('jwt-decode')

// Mock the Login component
jest.mock('@/components/login', () => {
  return function MockLogin() {
    return <div data-testid="mock-login">Mock Login Component</div>
  }
})

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders Login component when no token is present', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<LoginPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-login')).toBeInTheDocument()
    })
  })

  it('redirects to dashboard when valid token is present', async () => {
    const mockToken = 'valid_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('renders Login component when token is expired', async () => {
    const mockToken = 'expired_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: 0 })

    render(<LoginPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-login')).toBeInTheDocument()
    })
    expect(Cookies.remove).toHaveBeenCalledWith('token')
  })

  it('renders Login component when token is invalid', async () => {
    const mockToken = 'invalid_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    render(<LoginPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-login')).toBeInTheDocument()
    })
    expect(Cookies.remove).toHaveBeenCalledWith('token')
  })

  it('centers the Login component', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<LoginPage />)

    await waitFor(() => {
      const container = screen.getByTestId('mock-login').parentElement
      expect(container).toHaveClass('flex justify-center items-center min-h-screen')
    })
  })
})

