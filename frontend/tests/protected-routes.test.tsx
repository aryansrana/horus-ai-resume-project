import { render, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import LoginPage from '@/app/login/page'
import RegisterPage from '@/app/register/page'
import DashboardPage from '@/app/dashboard/page'
import JobDescriptionPage from '@/app/jobDescription/page'
import ResumeUploadPage from '@/app/resumeUpload/page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}))

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
}))

describe('Protected Routes', () => {
  const mockedUseRouter = useRouter as jest.Mock
  const mockedJwtDecode = jwtDecode as jest.Mock
  const mockedCookiesGet = Cookies.get as jest.Mock
  const mockedCookiesRemove = Cookies.remove as jest.Mock

  beforeEach(() => {
    mockedUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }))
    mockedJwtDecode.mockImplementation(() => ({ exp: Date.now() / 1000 + 3600 }))
    mockedCookiesGet.mockImplementation(() => 'fake-token')
    mockedCookiesRemove.mockImplementation(() => {})
  })

  it('redirects to login when not authenticated', async () => {
    mockedCookiesGet.mockImplementation(() => null)

    render(<DashboardPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/login')
    })

    render(<JobDescriptionPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/login')
    })

    render(<ResumeUploadPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/login')
    })
  })

  it('allows access to protected routes when authenticated', async () => {
    render(<DashboardPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).not.toHaveBeenCalled()
    })

    render(<JobDescriptionPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).not.toHaveBeenCalled()
    })

    render(<ResumeUploadPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).not.toHaveBeenCalled()
    })
  })

  it('redirects to dashboard when authenticated user tries to access login or register', async () => {
    render(<LoginPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/dashboard')
    })

    render(<RegisterPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('allows access to login and register when not authenticated', async () => {
    mockedCookiesGet.mockImplementation(() => null)

    render(<LoginPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).not.toHaveBeenCalled()
    })

    render(<RegisterPage />)
    await waitFor(() => {
      expect(mockedUseRouter().push).not.toHaveBeenCalled()
    })
  })
})

