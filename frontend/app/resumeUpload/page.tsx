'use client';

import axios from 'axios'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const validateToken = () => {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const decodedToken = jwtDecode(token) as DecodedToken
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
          // Token has expired
          Cookies.remove('token')
          router.push('/login')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Invalid token:', error)
        Cookies.remove('token')
        router.push('/login')
      }
    }

    validateToken()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }
  
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
      await axios.post('http://localhost:8080/api/resume-upload', formData, {
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 sm:p-6 md:p-8" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/50"></div>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
        <Image
          src="/images/goofyahh.png"
          alt="Company Logo"
          width={128}
          height={128}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
        />
      </div>
      <div className="w-full max-w-md bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg backdrop-blur-sm z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#9c8679]">Upload Resume</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="sr-only"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-[#9c8679] text-[#9c8679] rounded-md hover:bg-[#9c8679] hover:text-white transition-colors duration-300"
            >
              Choose File
            </label>
            <span className="ml-3 text-xs sm:text-sm text-gray-700 break-all">
              {file ? file.name : 'No file chosen'}
            </span>
          </div>
          <Button 
            type="submit" 
            disabled={!file}
            className="w-full bg-[#9c8679] hover:bg-[#8a7668] text-white transition-colors duration-300"
          >
            Upload Resume
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4 border-red-500 bg-red-50 text-red-700">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4 border-[#9c8679] bg-[#9c8679] bg-opacity-10 text-[#9c8679]">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}