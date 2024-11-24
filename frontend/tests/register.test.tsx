import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Register from '@/components/register'
import axios from 'axios'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('axios')

describe('Register Component', () => {
  const mockedUseRouter = useRouter as jest.Mock
  const mockedAxios = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    mockedUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }))
  })

  it('renders register form', () => {
    render(<Register />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('handles successful registration', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 201 })
    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      }, expect.any(Object))
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/login')
    })
  })

  it('handles registration failure', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: 'Email already exists' } } })
    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'existinguser' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument()
    })
  })

  it('validates password match', async () => {
    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })
})

