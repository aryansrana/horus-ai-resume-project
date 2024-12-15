import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AnalysisResults from '../components/AnalysisResults'

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(['mocked line']),
    save: jest.fn(),
  }))
})

describe('AnalysisResults', () => {
  const mockResults = {
    fit_score: 85,
    feedback: [
      { category: 'skills', text: 'Good match in skills' },
      { category: 'experience', text: 'More experience needed' },
    ],
    matching_keywords: ['react', 'typescript'],
  }

  const mockOnChooseAnotherPair = jest.fn()

  it('renders analysis results correctly', () => {
    render(<AnalysisResults results={mockResults} onChooseAnotherPair={mockOnChooseAnotherPair} />)

    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('Keyword Matches')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getByText('SKILLS:')).toBeInTheDocument()
    expect(screen.getByText('EXPERIENCE:')).toBeInTheDocument()
  })

  it('filters feedback correctly', async () => {
    render(<AnalysisResults results={mockResults} onChooseAnotherPair={mockOnChooseAnotherPair} />)

    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Skills'))

    await waitFor(() => {
      expect(screen.getByText('SKILLS:')).toBeInTheDocument()
      expect(screen.queryByText('EXPERIENCE:')).not.toBeInTheDocument()
    })
  })

  it('generates PDF when button is clicked', async () => {
    render(<AnalysisResults results={mockResults} onChooseAnotherPair={mockOnChooseAnotherPair} />)

    fireEvent.click(screen.getByText('Download Results'))

    await waitFor(() => {
      expect(screen.getByText('Download Results')).not.toBeDisabled()
    })
  })

  it('calls onChooseAnotherPair when button is clicked', () => {
    render(<AnalysisResults results={mockResults} onChooseAnotherPair={mockOnChooseAnotherPair} />)

    fireEvent.click(screen.getByText('Choose Another Pair'))

    expect(mockOnChooseAnotherPair).toHaveBeenCalled()
  })

  it('renders nothing when results are null', () => {
    const { container } = render(<AnalysisResults results={null} onChooseAnotherPair={mockOnChooseAnotherPair} />)
    expect(container.firstChild).toBeNull()
  })
})

