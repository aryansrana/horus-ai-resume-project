import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterForm } from '../components/RegisterForm'
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

describe('RegisterForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it('renders register form correctly', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
  })

  it('handles form submission correctly', async () => {
    const mockToken = 'mock-token'
    ;(axios.post as jest.Mock).mockResolvedValueOnce({ status: 201 })
    ;(axios.post as jest.Mock).mockResolvedValueOnce({ status: 200, data: { token: mockToken } })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      })
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(setTokenCookie).toHaveBeenCalledWith(mockToken)
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays error toast when passwords do not match', async () => {
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match')
    })
  })

  it('displays error toast on registration failure', async () => {
    const errorMessage = 'An error occurred. Please try again.'
    ;(axios.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: errorMessage } },
    })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('disables submit button while loading', async () => {
    (axios.post as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})

