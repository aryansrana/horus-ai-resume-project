import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import jsPDF from 'jspdf'

interface AnalysisResults {
  fit_score: number
  feedback: string[]
  matching_keywords: string[]
}

interface AnalysisResultsProps {
  results: AnalysisResults | null
  onChooseAnotherPair: () => void
}

export default function AnalysisResults({ results, onChooseAnotherPair }: AnalysisResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  if (!results) return null

  const formatKeyword = (keyword: string) => {
    const stripped = keyword.replace(/[, ]/g, '');
    return stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase() : '';
  }

  const generatePDF = () => {
    setIsGeneratingPDF(true)
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Resume Analysis Report", 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Fit Score: ${results.fit_score.toFixed(1)}%`, 20, 30)
    
    doc.text("Matched Keywords:", 20, 40)
    const formattedKeywords = results.matching_keywords.map(formatKeyword).filter(Boolean)
    formattedKeywords.forEach((keyword, index) => {
      doc.text(`- ${keyword}`, 30, 50 + index * 10)
    })
    
    const feedbackStartY = 50 + formattedKeywords.length * 10 + 10
    doc.text("Feedback:", 20, feedbackStartY)
    let currentY = feedbackStartY + 10
    results.feedback.forEach((item) => {
      const lines = doc.splitTextToSize(item, 160)
      doc.text("- ", 30, currentY)
      doc.text(lines, 35, currentY)
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
          <div className="text-4xl font-bold mb-2">{results.fit_score.toFixed(1)}%</div>
          <Progress value={results.fit_score} className="w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Keyword Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {results.matching_keywords
              .map(formatKeyword)
              .filter(Boolean)
              .length > 0 ? (
              <ul className="list-disc pl-5">
                {results.matching_keywords
                  .map(formatKeyword)
                  .filter(Boolean)
                  .map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No matching keywords found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            {results.feedback.length > 0 ? (
              <ul className="list-disc pl-5">
                {results.feedback.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No feedback available.</p>
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

