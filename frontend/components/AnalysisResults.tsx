import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

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
  if (!results) return null

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
            <ul className="list-disc pl-5">
              {results.matching_keywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {results.feedback.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" disabled>Download Results</Button>
        <Button onClick={onChooseAnotherPair}>Choose Another Pair</Button>
      </div>
    </div>
  )
}

