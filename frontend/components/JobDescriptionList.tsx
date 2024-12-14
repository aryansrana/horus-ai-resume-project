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
import { removeTokenCookie } from '@/utils/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  const [newName, setNewName] = useState({ value: '', length: 0 })
  const [newJobDescription, setNewJobDescription] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const fetchJobDescriptions = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/job-descriptions/${email}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if(response.status === 400){
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      }
      setJobDescriptions(response.data.descriptions)
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        console.error(error);
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
    if (!newName.value || !newJobDescription) return
    if (newName.length > 50 || newJobDescription.length > 5000) return

    setAdding(true)
    try {
      await axios.post('http://localhost:8080/api/job-description', 
        {
          email,
          name: newName.value,
          job_description: newJobDescription,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      toast.success('Job description added successfully')
      setNewName({ value: '', length: 0 })
      setNewJobDescription('')
      setCharCount(0)
      fetchJobDescriptions()
      setIsDialogOpen(false)  // Close the dialog
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
    if (!newName.value) return

    try {
      await axios.put('http://localhost:8080/api/job-description', 
        { id, name: newName.value },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      toast.success('Job description renamed successfully')
      setRenaming(null)
      setNewName({ value: '', length: 0 })
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

  const handleDialogClose = () => {
    setNewName({ value: '', length: 0 })
    setNewJobDescription('')
    setCharCount(0)
  }

  useEffect(() => {
    if (!adding) {
      setCharCount(0)
    }
  }, [adding])

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Job Descriptions</CardTitle>
      </CardHeader>
      <CardContent>
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
              <TableRow key={jobDescription._id} className={selectedJobDescription === jobDescription._id ? 'bg-[#9c8679]/50 hover:bg-[#9c8679]' : 'hover:bg-accent'}>
                <TableCell>
                {renaming === jobDescription._id ? (
                  <Input
                    value={newName.value}
                    onChange={(e) => setNewName({ value: e.target.value, length: e.target.value.length })}
                    className="w-full"
                    autoFocus
                  />
                ) : (
                  jobDescription.name
                )}
              </TableCell>
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
                      <Button size="sm" onClick={() => handleRename(jobDescription._id)}>Save</Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRenaming(jobDescription._id)
                          setNewName({ value: jobDescription.name, length: jobDescription.name.length })
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
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) handleDialogClose()
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Job Description
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Job Description</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Job Description Name"
                        value={newName.value}
                        onChange={(e) => setNewName({ value: e.target.value, length: e.target.value.length })}
                        maxLength={50}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {newName.length}/50 characters
                      </p>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Job Description"
                          value={newJobDescription}
                          onChange={(e) => {
                            const input = e.target.value
                            setNewJobDescription(input)
                            setCharCount(input.length)
                          }}
                          maxLength={5000}
                        />
                        <p className={`text-sm ${charCount > 5000 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {charCount}/5000 characters
                        </p>
                      </div>
                      <Button 
                        onClick={handleAdd} 
                        disabled={adding || newName.length > 50 || charCount > 5000 || !newName.value || !newJobDescription}
                      >
                        {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )}
            {Array.from({ length: Math.max(0, 6 - jobDescriptions.length - 1) }).map((_, index) => (
              <TableRow key={`empty-${index}`} className="h-12">
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
      </CardContent>
    </Card>
  )
}

