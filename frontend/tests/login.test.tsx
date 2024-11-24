import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Login from '@/components/login'
import axios from 'axios'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('axios')

describe('Login Component', () => {
  const mockedUseRouter = useRouter as jest.Mock
  const mockedAxios = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    mockedUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }))
  })

  it('renders login form', () => {
    render(<Login />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } })
    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        email: 'test@example.com',
        password: 'password123',
      }, expect.any(Object))
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles login failure', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } })
    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})

