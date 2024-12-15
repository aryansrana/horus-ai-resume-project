import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import DashboardPage from '../app/dashboard/page'
import { getEmailFromToken } from '../utils/auth'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  getEmailFromToken: jest.fn(),
}))
jest.mock('../components/Dashboard', () => {
  return function MockDashboard({ initialEmail }: { initialEmail: string }) {
    return <div data-testid="dashboard">Dashboard: {initialEmail}</div>
  }
})

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Dashboard component when email is available', async () => {
    const mockEmail = 'test@example.com'
    ;(getEmailFromToken as jest.Mock).mockResolvedValue(mockEmail)

    const { container } = render(await DashboardPage())

    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.getByText(`Dashboard: ${mockEmail}`)).toBeInTheDocument()
  })

  it('redirects to login when email is not available', async () => {
    ;(getEmailFromToken as jest.Mock).mockResolvedValue(null)

    await DashboardPage()

    expect(redirect).toHaveBeenCalledWith('/login')
  })
})

