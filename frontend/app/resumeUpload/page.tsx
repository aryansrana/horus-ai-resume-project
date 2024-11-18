'use client';
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' && selectedFile.size <= 2 * 1024 * 1024) {
        setFile(selectedFile)
        setError('')
      } else {
        setFile(null)
        setError('Please upload a PDF file no larger than 2MB.')
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('resume_file', file)

    try {
      await axios.post('/api/resume-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSuccess('Resume uploaded successfully')
      setError('')
    } catch (err) {
      console.error(err);
      setError('Failed to upload resume. Please try again.')
      setSuccess('')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button type="submit" disabled={!file}>
          Upload Resume
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}