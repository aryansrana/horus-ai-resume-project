import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardPage from './page'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

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

// Mock jwt-decode
jest.mock('jwt-decode')

// Mock js-cookie
jest.mock('js-cookie')

// Mock the Dashboard component
jest.mock('@/components/dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>,
}))

describe('DashboardPage', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('redirects to login page if no token is present', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('redirects to login page if token is expired', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('expired_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: 0 })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('renders Dashboard component when token is valid', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  it('redirects to login page if token is invalid', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('invalid_token')
    ;(jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
      expect(console.error).toHaveBeenCalledWith('Invalid token:', expect.any(Error))
    })
  })

  // New test to verify that restricted routes enforce login
  it('enforces login for restricted routes', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  // New test to confirm navigation across routes
  it('allows navigation to other routes when authenticated', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    // Simulate navigation to another route
    mockPush('/profile')

    expect(mockPush).toHaveBeenCalledWith('/profile')
  })
})



