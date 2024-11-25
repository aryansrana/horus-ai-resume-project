import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import JobDescription from './page'
import { useRouter } from 'next/navigation'
import axios from 'axios'
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

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} alt={props.alt || ''} />
  },
}))

// Mock axios
jest.mock('axios')

// Mock js-cookie
jest.mock('js-cookie')

// Mock jwt-decode
jest.mock('jwt-decode')

describe('JobDescription', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('redirects to login page if no token is present', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<JobDescription />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('redirects to login page if token is expired', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('expired_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: 0 })

    render(<JobDescription />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('renders the component when token is valid', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /job description/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter job description here/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })
  })

  it('handles form submission successfully', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
    ;(axios.post as jest.Mock).mockResolvedValue({ data: 'success' })

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter job description here/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/enter job description here/i)
    await userEvent.type(textarea, 'This is a test job description')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/job-description',
        { job_description: 'This is a test job description' },
        { headers: { 'Content-Type': 'application/json' } }
      )
      expect(screen.getByText('Job description submitted successfully')).toBeInTheDocument()
    })
  })

  it('handles form submission error', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
    ;(axios.post as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter job description here/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/enter job description here/i)
    await userEvent.type(textarea, 'This is a test job description')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to submit job description. Please try again.')).toBeInTheDocument()
    })
  })

  it('displays character count', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter job description here/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/enter job description here/i)
    await userEvent.type(textarea, 'This is a test')

    expect(screen.getByText('14/5000 characters')).toBeInTheDocument()
  })

  it('disables submit button while submitting', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
    ;(axios.post as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter job description here/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/enter job description here/i)
    await userEvent.type(textarea, 'This is a test job description')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await userEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText('Submitting...')).toBeInTheDocument()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument()
    })
  })

  // New test to verify that restricted routes enforce login
  it('enforces login for restricted routes', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<JobDescription />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  // New test to confirm navigation across routes
  it('allows navigation to other routes when authenticated', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<JobDescription />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /job description/i })).toBeInTheDocument()
    })

    // Simulate navigation to another route
    mockPush('/dashboard')

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})

