'use client';
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const jobDescriptionSchema = z.object({
  jobDescription: z.string().min(1).max(5000),
})

export default function JobDescription() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const form = useForm<z.infer<typeof jobDescriptionSchema>>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      jobDescription: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof jobDescriptionSchema>) => {
    try {
      await axios.post('/api/job-description', values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setSuccess('Job description submitted successfully')
      setError('')
    } catch (err) {
      console.error(err);
      setError('Failed to submit job description. Please try again.')
      setSuccess('')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Job Description</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter job description here..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {form.watch('jobDescription').length}/5000 characters
            </span>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
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