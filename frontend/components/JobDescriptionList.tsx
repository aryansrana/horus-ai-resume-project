'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2, Plus, Pencil, Trash } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { removeTokenCookie, getEmailFromToken } from '@/utils/auth'

interface JobDescription {
  _id: string
  name: string
  job_description: string
  dateAdded: string
}

interface JobDescriptionListProps {
  email: string
  selectedJobDescription: string | null
  setSelectedJobDescription: (id: string | null) => void
}

export default function JobDescriptionList({ email, selectedJobDescription, setSelectedJobDescription }: JobDescriptionListProps) {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newJobDescription, setNewJobDescription] = useState('')
  const router = useRouter()

  const fetchJobDescriptions = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/job-descriptions', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getEmailFromToken()}`
          }
        }
      )

      setJobDescriptions(response.data.descriptions)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to fetch job descriptions')
      }
    } finally {
      setLoading(false)
    }
  }, [email, router])

  useEffect(() => {
    fetchJobDescriptions()
  }, [fetchJobDescriptions])

  const handleAdd = async () => {
    if (!newName || !newJobDescription) return

    setAdding(true)
    try {
      await axios.post('http://localhost:8080/api/job-description', 
        {
          email,
          name: newName,
          job_description: newJobDescription,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getEmailFromToken()}`
          }
        }
      )

      toast.success('Job description added successfully')
      setNewName('')
      setNewJobDescription('')
      fetchJobDescriptions()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to add job description')
      }
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('http://localhost:8080/api/job-description', {
        data: { id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getEmailFromToken()}`
        }
      })

      toast.success('Job description deleted successfully')
      fetchJobDescriptions()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to delete job description')
      }
    }
  }

  const handleRename = async (id: string) => {
    if (!newName) return

    try {
      await axios.put('http://localhost:8080/api/job-description', 
        { id, name: newName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getEmailFromToken()}`
          }
        }
      )

      toast.success('Job description renamed successfully')
      setRenaming(null)
      setNewName('')
      fetchJobDescriptions()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to rename job description')
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">Job Descriptions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobDescriptions.map((jobDescription) => (
            <TableRow key={jobDescription._id} className={selectedJobDescription === jobDescription._id ? 'bg-accent' : ''}>
              <TableCell>{jobDescription.name}</TableCell>
              <TableCell>{new Date(jobDescription.dateAdded).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJobDescription(jobDescription._id)}
                  >
                    Select
                  </Button>
                  {renaming === jobDescription._id ? (
                    <div className="flex space-x-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-32"
                      />
                      <Button size="sm" onClick={() => handleRename(jobDescription._id)}>Save</Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRenaming(jobDescription._id)
                        setNewName(jobDescription.name)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(jobDescription._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {jobDescriptions.length < 6 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add New Job Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Job Description</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="Job Description Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      maxLength={50}
                    />
                    <Textarea
                      placeholder="Job Description"
                      value={newJobDescription}
                      onChange={(e) => setNewJobDescription(e.target.value)}
                      maxLength={5000}
                    />
                    <Button onClick={handleAdd} disabled={adding}>
                      {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add'}
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )}
          {Array.from({ length: Math.max(0, 6 - jobDescriptions.length - 1) }).map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {jobDescriptions.length >= 6 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Maximum of 6 job descriptions reached. Please delete one to add another.
        </p>
      )}
    </div>
  )
}

