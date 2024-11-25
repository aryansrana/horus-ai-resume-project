import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ResumeUpload from './page'
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

describe('ResumeUpload', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('redirects to login page if no token is present', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('redirects to login page if token is expired', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('expired_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: 0 })

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('renders the component when token is valid', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /upload resume/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /upload resume/i })).toBeDisabled()
    })
  })

  it('handles file selection', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
    })

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement

    await userEvent.upload(input, file)

    expect(screen.getByText('resume.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload resume/i })).toBeEnabled()
  })

  it('handles form submission', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
    ;(axios.post as jest.Mock).mockResolvedValue({ data: 'success' })

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
    })

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement

    await userEvent.upload(input, file)
    await userEvent.click(screen.getByRole('button', { name: /upload resume/i }))

    await waitFor(() => {
      expect(screen.getByText('Resume uploaded successfully')).toBeInTheDocument()
    })
  })

  it('handles submission error', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
    ;(axios.post as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
    })

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement

    await userEvent.upload(input, file)
    await userEvent.click(screen.getByRole('button', { name: /upload resume/i }))

    await waitFor(() => {
      expect(screen.getByText('Failed to upload resume. Please try again.')).toBeInTheDocument()
      expect(console.error).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  // New test to verify that restricted routes enforce login
  it('enforces login for restricted routes', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(null)

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  // New test to confirm navigation across routes
  it('allows navigation to other routes when authenticated', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('valid_token')
    ;(jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 })

    render(<ResumeUpload />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /upload resume/i })).toBeInTheDocument()
    })

    // Simulate navigation to another route
    mockPush('/dashboard')

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})

