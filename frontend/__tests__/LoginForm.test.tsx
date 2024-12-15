import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginForm } from '../components/LoginForm'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { setTokenCookie } from '../utils/auth'

// Mock the dependencies
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  setTokenCookie: jest.fn(),
}))

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders login form', () => {
    render(<LoginForm />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })

  it('handles input changes', () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('submits the form successfully', async () => {
    ;(axios.post as jest.Mock).mockResolvedValue({ status: 200, data: { token: 'fake-token' } })
    ;(setTokenCookie as jest.Mock).mockResolvedValue(true)

    render(<LoginForm />)
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(setTokenCookie).toHaveBeenCalledWith('fake-token')
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles login failure', async () => {
    ;(axios.post as jest.Mock).mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } })

    render(<LoginForm />)
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred. Please try again.')
    })
  })

  it('handles cookie setting failure', async () => {
    ;(axios.post as jest.Mock).mockResolvedValue({ status: 200, data: { token: 'fake-token' } })
    ;(setTokenCookie as jest.Mock).mockResolvedValue(false)

    render(<LoginForm />)
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to set authentication cookie. Please try again.')
    })
  })
})
