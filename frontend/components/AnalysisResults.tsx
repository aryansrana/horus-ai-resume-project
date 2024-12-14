'use client';

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import jsPDF from 'jspdf'

interface Feedback {
  category: string
  text: string
}

interface AnalysisResults {
  fit_score: number
  feedback: Feedback[]
  matching_keywords: string[]
}

interface AnalysisResultsProps {
  results: AnalysisResults | null
  onChooseAnotherPair: () => void
}

export default function AnalysisResults({ results, onChooseAnotherPair }: AnalysisResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [feedbackFilter, setFeedbackFilter] = useState('all')

  const filteredFeedback = useMemo(() => {
    if (!results) return []
    if (feedbackFilter === 'all') return results.feedback
    return results.feedback.filter(item => item.category.toLowerCase() === feedbackFilter)
  }, [results, feedbackFilter])

  if (!results) return null

  const generatePDF = () => {
    setIsGeneratingPDF(true)
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Resume Analysis Report", 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Fit Score: ${results.fit_score}%`, 20, 30)
    
    doc.text("Matched Keywords:", 20, 40)
    results.matching_keywords.forEach((keyword, index) => {
      doc.text(`- ${keyword}`, 30, 50 + index * 10)
    })
    
    const feedbackStartY = 50 + results.matching_keywords.length * 10 + 10
    doc.text("Feedback:", 20, feedbackStartY)
    let currentY = feedbackStartY + 10
    results.feedback.forEach((item) => {
      const lines = doc.splitTextToSize(`${item.category.toUpperCase()}: ${item.text}`, 160)
      doc.text(lines, 30, currentY)
      currentY += lines.length * 10 + 5
    })
    
    doc.save("Resume_Analysis_Report.pdf")
    setIsGeneratingPDF(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">{results.fit_score}%</div>
          <Progress value={results.fit_score} className="w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Keyword Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {results.matching_keywords.length > 0 ? (
              <ul className="list-disc pl-5">
                {results.matching_keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No matching keywords found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Suggestions</CardTitle>
            <Select
              value={feedbackFilter}
              onValueChange={(value) => setFeedbackFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredFeedback.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {filteredFeedback.map((item, index) => (
                  <li key={index}>
                    <strong>{item.category.toUpperCase()}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No feedback available for the selected category.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={generatePDF} 
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Download Results'}
        </Button>
        <Button onClick={onChooseAnotherPair}>Choose Another Pair</Button>
      </div>
    </div>
  )
}

