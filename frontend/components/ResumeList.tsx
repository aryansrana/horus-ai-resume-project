'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2, Upload, Pencil, Trash } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface Resume {
  _id: string
  name: string
  dateAdded: string
}

interface ResumeListProps {
  email: string
  selectedResume: string | null
  setSelectedResume: (id: string | null) => void
}

export default function ResumeList({ email, selectedResume, setSelectedResume }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const router = useRouter()

  const fetchResumes = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/resumes', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getEmailFromToken}`
          }
        }
      )

      setResumes(response.data.resumes)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to fetch resumes')
      }
    } finally {
      setLoading(false)
    }
  }, [email, router])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)

    try {
      await axios.post('http://localhost:8080/api/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getEmailFromToken()}`
        }
      })

      toast.success('Resume uploaded successfully')
      fetchResumes()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to upload resume')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('http://localhost:8080/api/resume', {
        data: { id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getEmailFromToken()}`
        }
      })

      toast.success('Resume deleted successfully')
      fetchResumes()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to delete resume')
      }
    }
  }

  const handleRename = async (id: string) => {
    if (!newName) return

    try {
      await axios.put('http://localhost:8080/api/resume', 
        { id, name: newName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getEmailFromToken()}`
          }
        }
      )

      toast.success('Resume renamed successfully')
      setRenaming(null)
      setNewName('')
      fetchResumes()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        await removeTokenCookie()
        router.push('/login')
      } else {
        toast.error('Failed to rename resume')
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">Resumes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume._id} className={selectedResume === resume._id ? 'bg-accent' : ''}>
              <TableCell>{resume.name}</TableCell>
              <TableCell>{new Date(resume.dateAdded).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResume(resume._id)}
                  >
                    Select
                  </Button>
                  {renaming === resume._id ? (
                    <div className="flex space-x-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-32"
                      />
                      <Button size="sm" onClick={() => handleRename(resume._id)}>Save</Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRenaming(resume._id)
                        setNewName(resume.name)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resume._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {resumes.length < 6 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" /> Upload New Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Resume</DialogTitle>
                    </DialogHeader>
                    <Input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                    {uploading && <Loader2 className="animate-spin" />}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )}
          {Array.from({ length: Math.max(0, 6 - resumes.length - 1) }).map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {resumes.length >= 6 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Maximum of 6 resumes reached. Please delete one to add another.
        </p>
      )}
    </div>
  )
}

