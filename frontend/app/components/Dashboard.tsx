import { useState, useEffect } from 'react'
import axios from 'axios'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalysisResult {
  fitScore: number
  matchedSkills: string[]
  suggestions: string[]
}

export default function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalysisResult = async () => {
      try {
        const response = await axios.get('/api/analysis-result', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setAnalysisResult(response.data)
      } catch (err) {
        setError('Failed to fetch analysis result')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysisResult()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Analysis Dashboard</h1>
      {analysisResult && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resume Fit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={analysisResult.fitScore} className="w-full" />
              <p className="mt-2 text-center">{analysisResult.fitScore}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Matched Skills and Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {analysisResult.matchedSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}