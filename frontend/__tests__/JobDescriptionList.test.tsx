import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import JobDescriptionList from '../components/JobDescriptionList'

// Mock the dependencies
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('../utils/auth', () => ({
  removeTokenCookie: jest.fn(),
}))

// Mock the UI components
jest.mock('../components/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))
jest.mock('../components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))
jest.mock('../components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}))
jest.mock('../components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogTrigger: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('../components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}))
jest.mock('../components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
}))

describe('JobDescriptionList', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  const mockEmail = 'test@example.com'
  const mockJobDescriptions = [
    { _id: '1', name: 'Job 1', job_description: 'Description 1', dateAdded: '2023-01-01' },
    { _id: '2', name: 'Job 2', job_description: 'Description 2', dateAdded: '2023-01-02' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(axios.get as jest.Mock).mockResolvedValue({ data: { descriptions: mockJobDescriptions } })
  })

  it('renders job descriptions', async () => {
    render(<JobDescriptionList email={mockEmail} selectedJobDescription={null} setSelectedJobDescription={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument()
      expect(screen.getByText('Job 2')).toBeInTheDocument()
    })
  })

  it('handles adding a new job description', async () => {
    ;(axios.post as jest.Mock).mockResolvedValue({})

    render(<JobDescriptionList email={mockEmail} selectedJobDescription={null} setSelectedJobDescription={() => {}} />)

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Add New Job Description')[0])
    })

    fireEvent.change(screen.getByPlaceholderText('Job Description Name'), { target: { value: 'New Job' } })
    fireEvent.change(screen.getByPlaceholderText('Job Description'), { target: { value: 'New Description' } })
    fireEvent.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/job-description',
        {
          email: mockEmail,
          name: 'New Job',
          job_description: 'New Description',
        },
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Job description added successfully')
    })
  })

  it('handles deleting a job description', async () => {
    ;(axios.delete as jest.Mock).mockResolvedValue({})

    render(<JobDescriptionList email={mockEmail} selectedJobDescription={null} setSelectedJobDescription={() => {}} />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: '' })
      fireEvent.click(deleteButtons[1]) // Click the delete button for the second job
    })

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:8080/api/job-description',
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Job description deleted successfully')
    })
  })

  it('handles renaming a job description', async () => {
    ;(axios.put as jest.Mock).mockResolvedValue({})

    render(<JobDescriptionList email={mockEmail} selectedJobDescription={null} setSelectedJobDescription={() => {}} />)

    await waitFor(() => {
      const renameButtons = screen.getAllByRole('button', { name: '' })
      fireEvent.click(renameButtons[0]) // Click the rename button for the first job
    })

    fireEvent.change(screen.getAllByDisplayValue('Job 1')[0], { target: { value: 'Renamed Job' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/job-description',
        { id: '1', name: 'Renamed Job' },
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Job description renamed successfully')
    })
  })

  it('handles session expiration', async () => {
    ;(axios.get as jest.Mock).mockRejectedValue({ response: { status: 401 } })

    render(<JobDescriptionList email={mockEmail} selectedJobDescription={null} setSelectedJobDescription={() => {}} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch job descriptions')
    })
  })
})

