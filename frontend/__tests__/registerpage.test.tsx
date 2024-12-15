import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import RegisterPage from '../app/register/page'
import { getEmailFromToken } from '../utils/auth'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  getEmailFromToken: jest.fn(),
}))
jest.mock('../components/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">Mocked RegisterForm</div>,
}))
jest.mock('../components/Logo', () => ({
  Logo: () => <div data-testid="logo">Mocked Logo</div>,
}))

describe('RegisterPage', () => {
  it('redirects to dashboard if email is found', async () => {
    (getEmailFromToken as jest.Mock).mockResolvedValue('user@example.com')
    const redirectMock = jest.fn()
    jest.spyOn(require('next/navigation'), 'redirect').mockImplementation(redirectMock)

    await RegisterPage()

    expect(redirectMock).toHaveBeenCalledWith('/dashboard')
  })

  it('renders RegisterForm and Logo when no email is found', async () => {
    (getEmailFromToken as jest.Mock).mockResolvedValue(null)

    const { container } = render(await RegisterPage())

    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('register-form')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('flex flex-col items-center justify-center min-h-screen bg-background')
  })
})

