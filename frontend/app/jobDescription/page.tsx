'use client';
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'

interface DecodedToken {
  userId : string;
  email : string;
  username : string;
  exp: number;
}

const jobDescriptionSchema = z.object({
  job_description: z.string().min(1).max(5000),
})

export default function JobDescription() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof jobDescriptionSchema>>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      job_description: '',
    },
  })

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

  const onSubmit = async (values: z.infer<typeof jobDescriptionSchema>) => {
    setIsSubmitting(true)
    try {
      await axios.post('http://localhost:8080/api/job-description', values, {
        headers: { 'Content-Type': 'application/json'}
      })
      setSuccess('Job description submitted successfully')
      setError('')
    } catch (err) {
      console.error(err);
      setError('Failed to submit job description. Please try again.')
      setSuccess('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 sm:p-6 md:p-8 lg:p-12" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/50 backdrop-blur-sm"></div>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
        <Image
          src="/images/goofyahh.png"
          alt="Company Logo"
          width={128}
          height={128}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
        />
      </div>
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white bg-opacity-90 p-6 sm:p-8 md:p-10 rounded-lg shadow-lg backdrop-blur-sm z-10 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-[#9c8679] transition-colors duration-300 hover:text-[#8a7668]">Job Description</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="job_description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job description here..."
                      className="h-32 md:h-40 lg:h-48 border-[#9c8679] focus:ring-[#9c8679] focus:border-[#9c8679] transition-all duration-300 hover:border-[#8a7668]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
                {form.watch('job_description').length}/5000 characters
              </span>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#9c8679] hover:bg-[#8a7668] text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#9c8679] focus:ring-opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
        </Form>
        {error && (
          <Alert variant="destructive" className="mt-4 border-red-500 bg-red-50 text-red-700 transition-all duration-300 hover:bg-red-100">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4 border-[#9c8679] bg-[#9c8679] bg-opacity-10 text-[#9c8679] transition-all duration-300 hover:bg-opacity-20">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

