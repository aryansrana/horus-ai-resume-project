'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// Mock data for the dashboard
const mockData = {
  fitScore: 75,
  matchedSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs'],
  matchedKeywords: ['frontend development', 'responsive design', 'agile methodology'],
  improvementSuggestions: [
    { type: 'add', text: 'Include more details about your experience with cloud platforms' },
    { type: 'remove', text: 'Remove outdated skills like jQuery' },
    { type: 'improve', text: 'Elaborate on your role in team projects' }
  ]
}

export function Dashboard() {
  const [data, setData] = useState(mockData)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'remove':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'improve':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-6">Resume Analysis Dashboard</h1>
    
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="text-3xl font-bold">Resume Fit Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className={`text-6xl font-bold ${getScoreColor(data.fitScore)}`}>
              {data.fitScore}%
            </div>
          </div>
          <Progress value={data.fitScore} className="mt-6" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Matches</CardTitle>
          <CardDescription>Areas matching job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.matchedSkills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 mt-4">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {data.matchedKeywords.map((keyword, index) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Improvement Suggestions</CardTitle>
          <CardDescription>Areas to focus on for improving your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {data.improvementSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                {getImprovementIcon(suggestion.type)}
                <span>{suggestion.text}</span>
              </li>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="mt-6 text-center">
      <Button onClick={() => setData({ ...mockData, fitScore: Math.floor(Math.random() * 100) })}>
        Refresh Analysis
      </Button>
    </div>
  </div>
  )
}

