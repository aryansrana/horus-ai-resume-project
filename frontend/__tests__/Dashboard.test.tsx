import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Dashboard from '../components/Dashboard'
import { getEmailFromToken, removeTokenCookie } from '../utils/auth'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../utils/auth', () => ({
  getEmailFromToken: jest.fn(),
  removeTokenCookie: jest.fn(),
}))
jest.mock('../components/Navbar', () => {
  return function MockNavbar({ email }: { email: string }) {
    return <div data-testid="navbar">Navbar: {email}</div>
  }
})
jest.mock('../components/ResumeList', () => {
  return function MockResumeList({ email, selectedResume, setSelectedResume }: any) {
    return (
      <div data-testid="resume-list">
        ResumeList: {email}
        <button onClick={() => setSelectedResume('resume1')}>Select Resume</button>
      </div>
    )
  }
})
jest.mock('../components/JobDescriptionList', () => {
  return function MockJobDescriptionList({ email, selectedJobDescription, setSelectedJobDescription }: any) {
    return (
      <div data-testid="job-description-list">
        JobDescriptionList: {email}
        <button onClick={() => setSelectedJobDescription('job1')}>Select Job</button>
      </div>
    )
  }
})
jest.mock('../components/AnalysisResults', () => {
  return function MockAnalysisResults({ results, onChooseAnotherPair }: any) {
    return (
      <div data-testid="analysis-results">
        AnalysisResults
        <button onClick={onChooseAnotherPair}>Choose Another Pair</button>
      </div>
    )
  }
})

describe('Dashboard', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  const initialEmail = 'test@example.com'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(getEmailFromToken as jest.Mock).mockResolvedValue(initialEmail)
  })

  it('renders dashboard components', async () => {
    render(<Dashboard initialEmail={initialEmail} />)

    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('resume-list')).toBeInTheDocument()
      expect(screen.getByTestId('job-description-list')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument()
    })
  })

  it('handles analyze button click', async () => {
    const mockAnalysisResults = {
      fit_score: 85,
      feedback: [{ category: 'skills', text: 'Good match' }],
      matching_keywords: ['react', 'typescript'],
    }
    ;(axios.post as jest.Mock).mockResolvedValue({ data: mockAnalysisResults })

    render(<Dashboard initialEmail={initialEmail} />)

    fireEvent.click(screen.getByText('Select Resume'))
    fireEvent.click(screen.getByText('Select Job'))
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    await waitFor(() => {
      expect(screen.getByTestId('analysis-results')).toBeInTheDocument()
    })
  })

  it('handles analyze button click with missing selections', async () => {
    render(<Dashboard initialEmail={initialEmail} />)

    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select both a resume and a job description')
    })
  })

  it('handles session expiration', async () => {
    ;(getEmailFromToken as jest.Mock).mockResolvedValue(null)

    render(<Dashboard initialEmail={initialEmail} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Your session has expired. Please log in again.')
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  it('handles analysis error', async () => {
    const errorMessage = 'A network error occurred. Please try again.'
    ;(axios.post as jest.Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { error: errorMessage } },
    })

    render(<Dashboard initialEmail={initialEmail} />)

    fireEvent.click(screen.getByText('Select Resume'))
    fireEvent.click(screen.getByText('Select Job'))
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('handles choose another pair', async () => {
    const mockAnalysisResults = {
      fit_score: 85,
      feedback: [{ category: 'skills', text: 'Good match' }],
      matching_keywords: ['react', 'typescript'],
    }
    ;(axios.post as jest.Mock).mockResolvedValue({ data: mockAnalysisResults })

    render(<Dashboard initialEmail={initialEmail} />)

    fireEvent.click(screen.getByText('Select Resume'))
    fireEvent.click(screen.getByText('Select Job'))
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    await waitFor(() => {
      expect(screen.getByTestId('analysis-results')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Choose Another Pair'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument()
    })
  })
})

