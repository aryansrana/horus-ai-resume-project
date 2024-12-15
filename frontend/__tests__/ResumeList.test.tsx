import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ResumeList from '../components/ResumeList'

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
jest.mock('../components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
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

describe('ResumeList', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  const mockEmail = 'test@example.com'
  const mockResumes = [
    { _id: '1', name: 'Resume 1', dateAdded: '2023-01-01' },
    { _id: '2', name: 'Resume 2', dateAdded: '2023-01-02' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(axios.get as jest.Mock).mockResolvedValue({ data: { resumes: mockResumes } })
  })

  it('renders resumes', async () => {
    render(<ResumeList email={mockEmail} selectedResume={null} setSelectedResume={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Resume 1')).toBeInTheDocument()
      expect(screen.getByText('Resume 2')).toBeInTheDocument()
    })
  })

  it('handles uploading a new resume', async () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
    ;(axios.post as jest.Mock).mockResolvedValue({})

    render(<ResumeList email={mockEmail} selectedResume={null} setSelectedResume={() => {}} />)

    await waitFor(() => {
      const uploadButtons = screen.getAllByText('Upload New Resume')
      fireEvent.click(uploadButtons[0]) // Click the first "Upload New Resume" button
    })

    const fileInput = screen.getByTestId('file-input')
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/resume-upload',
        expect.any(FormData),
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Resume uploaded successfully')
    })
  })

  it('handles deleting a resume', async () => {
    ;(axios.delete as jest.Mock).mockResolvedValue({})

    render(<ResumeList email={mockEmail} selectedResume={null} setSelectedResume={() => {}} />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: '' })
      fireEvent.click(deleteButtons[1]) // Click the delete button for the second resume
    })

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:8080/api/resume',
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Resume deleted successfully')
    })
  })

  it('handles renaming a resume', async () => {
    ;(axios.put as jest.Mock).mockResolvedValue({})

    render(<ResumeList email={mockEmail} selectedResume={null} setSelectedResume={() => {}} />)

    await waitFor(() => {
      const renameButtons = screen.getAllByRole('button', { name: '' })
      fireEvent.click(renameButtons[0]) // Click the rename button for the first resume
    })

    fireEvent.change(screen.getByDisplayValue('Resume 1'), { target: { value: 'Renamed Resume' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/resume',
        { id: '1', name: 'Renamed Resume' },
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith('Resume renamed successfully')
    })
  })

  it('handles session expiration', async () => {
    ;(axios.get as jest.Mock).mockRejectedValue({ response: { status: 401 } })

    render(<ResumeList email={mockEmail} selectedResume={null} setSelectedResume={() => {}} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch resumes')
    })
  })
})

