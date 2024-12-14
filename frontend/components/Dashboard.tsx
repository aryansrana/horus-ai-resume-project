'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import Navbar from './Navbar'
import ResumeList from './ResumeList'
import JobDescriptionList from './JobDescriptionList'
import AnalysisResults from './AnalysisResults'
import { Button } from '@/components/ui/button'
import {removeTokenCookie, getEmailFromToken } from '@/utils/auth'

interface Feedback {
  category: string
  text: string
}

interface AnalysisResults {
  fit_score: number
  feedback: Feedback[]
  matching_keywords: string[]
}


interface DashboardProps {
  initialEmail: string
}

export default function Dashboard({ initialEmail }: DashboardProps) {
  const [email, setEmail] = useState(initialEmail)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [selectedJobDescription, setSelectedJobDescription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkEmail = async () => {
      const email = await getEmailFromToken();
      if(!email){
        toast.error('Your session has expired. Please log in again.')
        router.push('/login')
      }
      else{
        setEmail(email);
      }
    }

    checkEmail()
    const interval = setInterval(checkEmail, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [router])

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJobDescription) {
      toast.error('Please select both a resume and a job description')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:8080/api/analyze', 
        {
          resume_id: selectedResume,
          description_id: selectedJobDescription,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      setAnalysisResults(response.data)
      setShowAnalysis(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Your session has expired. Please log in again.')
          await removeTokenCookie()
          router.push('/login')
        } else {
          // Display the error message from the response body
          const errorMessage = error.response?.data?.error || 'An unexpected error occurred.'
          toast.error(errorMessage)
        }
      } else {
        toast.error('A network error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChooseAnotherPair = () => {
    setShowAnalysis(false)
    setSelectedResume(null)
    setSelectedJobDescription(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar email={email} />
      <main className="container mx-auto p-4">
        {!showAnalysis ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResumeList
                email={email}
                selectedResume={selectedResume}
                setSelectedResume={setSelectedResume}
              />
              <JobDescriptionList
                email={email}
                selectedJobDescription={selectedJobDescription}
                setSelectedJobDescription={setSelectedJobDescription}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </>
        ) : (
          <AnalysisResults results={analysisResults} onChooseAnotherPair={handleChooseAnotherPair} />
        )}
      </main>
    </div>
  )
}

