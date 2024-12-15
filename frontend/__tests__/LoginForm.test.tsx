import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../components/LoginForm'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { setTokenCookie } from '../utils/auth'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../utils/auth', () => ({
  setTokenCookie: jest.fn(),
}))

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register')
  })

  it('handles form submission correctly', async () => {
    const mockToken = process.env.JWT_SECRET
    ;(axios.post as jest.Mock).mockResolvedValue({ status: 200, data: { token: mockToken } })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(setTokenCookie).toHaveBeenCalledWith(mockToken)
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays error toast on login failure', async () => {
    const errorMessage = 'An error occurred. Please try again.'
    ;(axios.post as jest.Mock).mockRejectedValue({
      isAxiosError: true,
      response: { data: { error: errorMessage } },
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('displays generic error toast on non-Axios error', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred. Please try again.')
    })
  })

  it('enables submit button when not loading', () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /log in/i })
    expect(submitButton).not.toBeDisabled()
    expect(submitButton).toHaveTextContent('Log in')
  })
})

