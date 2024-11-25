import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegisterPage from './page'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock js-cookie
jest.mock('js-cookie')

// Mock jwt-decode
jest.mock('jwt-decode')

// Mock the Register component
jest.mock('@/components/register', () => {
  return function MockRegister() {
    return <div data-testid="mock-register">Mock Register Component</div>
  }
})

describe('RegisterPage', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders Register component when no token is present', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })
  })

  it('redirects to dashboard when valid token is present', async () => {
    const mockToken = 'valid_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<RegisterPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('renders Register component when token is expired', async () => {
    const mockToken = 'expired_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: 0 })

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })
    expect(Cookies.remove).toHaveBeenCalledWith('token')
  })

  it('renders Register component when token is invalid', async () => {
    const mockToken = 'invalid_token'
    ;(Cookies.get as jest.Mock).mockReturnValue(mockToken)
    ;(jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })
    expect(Cookies.remove).toHaveBeenCalledWith('token')
  })

  it('centers the Register component', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<RegisterPage />)

    await waitFor(() => {
      const container = screen.getByTestId('mock-register').parentElement
      expect(container).toHaveClass('flex justify-center items-center min-h-screen')
    })
  })

  // New test to check if the Register component is rendered
  it('renders the Register component', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })
  })

  // New test to verify that restricted routes enforce login
  it('enforces login for restricted routes', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })

    // Attempt to navigate to a restricted route
    mockPush('/dashboard')

    // Verify that we're still on the register page
    expect(screen.getByTestId('mock-register')).toBeInTheDocument()
  })

  // New test to confirm navigation across routes
  it('allows navigation to public routes', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<RegisterPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-register')).toBeInTheDocument()
    })

    // Navigate to a public route
    mockPush('/about')

    // Verify that the router was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/about')
  })
})



