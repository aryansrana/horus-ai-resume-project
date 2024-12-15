import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../app/login/page'
import { getEmailFromToken } from '../utils/auth'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  getEmailFromToken: jest.fn(),
}))
jest.mock('../components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Mocked LoginForm</div>,
}))
jest.mock('../components/Logo', () => ({
  Logo: () => <div data-testid="logo">Mocked Logo</div>,
}))

describe('LoginPage', () => {
  it('redirects to dashboard if email is found', async () => {
    (getEmailFromToken as jest.Mock).mockResolvedValue('user@example.com')
    const redirectMock = jest.fn()
    jest.spyOn(require('next/navigation'), 'redirect').mockImplementation(redirectMock)

    await LoginPage()

    expect(redirectMock).toHaveBeenCalledWith('/dashboard')
  })

  it('renders LoginForm and Logo when no email is found', async () => {
    (getEmailFromToken as jest.Mock).mockResolvedValue(null)

    const { container } = render(await LoginPage())

    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('flex flex-col items-center justify-center min-h-screen bg-background')
  })
})

